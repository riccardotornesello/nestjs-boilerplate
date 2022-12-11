import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { User } from '../user/entities/user.entity';
import {
  validateBcrypt,
  generateRandomString,
  generateSha,
  generateBcrypt,
} from '../../common/crypto/utils';
import { UserNotFoundException } from '../../exceptions';
import { AuthToken } from './entities/auth-token.entity';
import { UserRegisterDto } from './dto/user-register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthToken)
    private readonly authTokenRepository: Repository<AuthToken>,
    private readonly userService: UserService,
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
    const userData = {...userRegisterDto};
    const userPassword = userData.password;
    delete userData.password

    return this.userService.createOne({...userData, passwordHash: generateBcrypt(userPassword)});
  }
}
