import {
  Controller,
  Post,
  Body,
  ValidationError,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { UserRegisterDto } from './dto/user-register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() userCredentialsDto: UserCredentialsDto) {
    const user = await this.authService.authenticateUser(userCredentialsDto);
    const token = await this.authService.generateAuthToken(user);

    return {
      token,
    };
  }

  @Post('register')
  async register(@Body() userRegisterDto: UserRegisterDto) {
    await Promise.all([
      this.userService.getByUsername(userRegisterDto.username),
      this.userService.getByEmail(userRegisterDto.email),
    ]).then((users) => {
      const [userByUsername, userByEmail] = users;
      const errors: ValidationError[] = [];

      if (userByUsername) {
        errors.push({
          target: userRegisterDto,
          property: 'username',
          value: userRegisterDto.username,
          constraints: {
            isUnique: 'Username already exists',
          },
        });
      }

      if (userByEmail) {
        errors.push({
          target: userRegisterDto,
          property: 'email',
          value: userRegisterDto.email,
          constraints: {
            isUnique: 'Email already exists',
          },
        });
      }

      if (errors.length > 0) {
        throw new UnprocessableEntityException(errors);
      }
    });

    const user = await this.authService.registerUser(userRegisterDto);
    const token = await this.authService.generateAuthToken(user);

    return {
      token,
    };
  }
}
