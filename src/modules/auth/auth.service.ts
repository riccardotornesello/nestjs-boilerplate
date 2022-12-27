import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';

import {
  generateBcrypt,
  generateRandomString,
  generateSha,
  validateBcrypt,
} from '../../common/crypto/utils';
import {
  InvalidTokenException,
  TokenExpiredException,
  UserNotFoundException,
} from '../../exceptions';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { AuthToken } from './entities/auth-token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthToken)
    private readonly authTokenRepository: EntityRepository<AuthToken>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async authenticateUser(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<User> {
    const user = await this.userService.findOne({
      username: userCredentialsDto.username,
    });

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

    return await this.userService.createOne({
      ...userData,
      passwordHash: generateBcrypt(userPassword),
    });
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
}
