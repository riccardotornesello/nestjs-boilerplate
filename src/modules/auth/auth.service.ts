import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository } from 'typeorm';

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
    private readonly authTokenRepository: Repository<AuthToken>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async authenticateUser(
    @InjectRepository(AuthToken)
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

    await this.authTokenRepository.save({
      user,
      tokenHash: generateSha(randomString),
    });

    return randomString;
  }

  async registerUser(userRegisterDto: UserRegisterDto): Promise<User> {
    const userData = { ...userRegisterDto };
    const userPassword = userData.password;
    delete userData.password;

    return this.userService.createOne({
      ...userData,
      passwordHash: generateBcrypt(userPassword),
    });
  }

  async getUserFromToken(token: string): Promise<User> {
    const authToken = await this.authTokenRepository.findOneBy({
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
