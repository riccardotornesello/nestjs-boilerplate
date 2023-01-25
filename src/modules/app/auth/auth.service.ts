import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { InvalidActionException, RateLimitException } from 'src/exceptions';
import {
  generateBcrypt,
  generateRandomString,
  generateSha,
  validateBcrypt,
} from 'src/utils/crypto';

import { MailService } from '../../shared/mail/mail.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { AuthToken } from './entities/auth-token.entity';
import { EmailVerification } from './entities/email-verification.entity';
import {
  EmailNotVerifiedException,
  InvalidTokenException,
  TokenExpiredException,
  UserNotFoundException,
} from './exceptions';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthToken)
    private readonly authTokenRepository: EntityRepository<AuthToken>,
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: EntityRepository<EmailVerification>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async authenticateUser(
    userCredentialsDto: UserCredentialsDto,
    checkEmailVerification = true,
  ): Promise<User> {
    const user = await this.userService.getByUsername(
      userCredentialsDto.username,
    );

    if (!user) {
      throw new UserNotFoundException();
    }

    const isPasswordValid = await validateBcrypt(
      userCredentialsDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UserNotFoundException();
    }

    if (checkEmailVerification && !user.emailVerification?.verifiedAt) {
      throw new EmailNotVerifiedException();
    }

    return user;
  }

  async generateAuthToken(user: User): Promise<string> {
    const randomString = generateRandomString(32);

    const authToken = this.authTokenRepository.create({
      user,
      tokenHash: generateSha(randomString),
    });
    await this.authTokenRepository.persistAndFlush(authToken);

    return randomString;
  }

  async registerUser(userRegisterDto: UserRegisterDto): Promise<User> {
    const userData = { ...userRegisterDto };
    const userPassword = userData.password;
    delete userData.password;

    const user = await this.userService.createOne({
      ...userData,
      passwordHash: generateBcrypt(userPassword),
    });

    const emailVerification = this.emailVerificationRepository.create({
      user,
    });
    await this.emailVerificationRepository.persistAndFlush(emailVerification);
    return user;
  }

  async getUserFromToken(token: string): Promise<User> {
    const authToken = await this.authTokenRepository.findOne({
      tokenHash: generateSha(token),
    });

    if (!authToken) {
      throw new InvalidTokenException();
    }

    if (
      moment(authToken.createdAt).add(
        this.configService.get('auth.tokenTtl'),
        's',
      ) < moment()
    ) {
      throw new TokenExpiredException();
    }

    return authToken.user;
  }

  async sendEmailVerification(user: User): Promise<void> {
    let emailVerification = user.emailVerification;

    if (!emailVerification) {
      emailVerification = this.emailVerificationRepository.create({
        user,
      });
    }

    if (emailVerification.verifiedAt) {
      throw new InvalidActionException();
    }

    if (
      emailVerification.lastSent &&
      moment(emailVerification.lastSent).add(60, 's') > moment()
    ) {
      throw new RateLimitException();
    }

    const verificationToken = generateRandomString(32);

    emailVerification.verificationToken = generateSha(verificationToken);
    emailVerification.lastSent = new Date();
    await this.emailVerificationRepository.persistAndFlush(emailVerification);

    try {
      await this.mailService.sendMail({
        to: user.email,
        subject: 'Email verification',
        text: `Please verify your email by clicking on the following link: ${this.configService.get(
          'app.frontendBaseUrl',
        )}/auth/verify-email/${verificationToken}`,
      });
    } catch (e) {}
  }

  async verifyEmail(verificationToken: string): Promise<User> {
    const emailVerification = await this.emailVerificationRepository.findOne({
      verificationToken: generateSha(verificationToken),
      verifiedAt: null,
    });

    if (!emailVerification) {
      throw new InvalidTokenException();
    }

    emailVerification.verificationToken = null;
    emailVerification.verifiedAt = new Date();
    await this.emailVerificationRepository.persistAndFlush(emailVerification);

    return emailVerification.user;
  }
}
