import { Body, Controller, Post } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import {
  EmailVerificationDto,
  UserCredentialsDto,
  UserRegisterDto,
} from './dto';

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
    const user = await this.authService.registerUser(userRegisterDto);
    await this.authService.sendEmailVerification(user);
  }

  @Post('email/verification-resend')
  async resendEmailVerification(
    @Body() userCredentialsDto: UserCredentialsDto,
  ) {
    const user = await this.authService.authenticateUser(
      userCredentialsDto,
      false,
    );
    await this.authService.sendEmailVerification(user);
  }

  @Post('email/verify')
  async verifyEmail(@Body() emailVerificationDto: EmailVerificationDto) {
    const user = await this.authService.verifyEmail(
      emailVerificationDto.verificationToken,
    );
    const token = await this.authService.generateAuthToken(user);

    return {
      token,
    };
  }
}
