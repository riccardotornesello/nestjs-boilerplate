import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { UserRegisterDto } from './dto/user-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    const token = await this.authService.generateAuthToken(user);

    return {
      token,
    };
  }
}
