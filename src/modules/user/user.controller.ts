// NestJS
import { Controller, Get, Request } from '@nestjs/common';

// Constants
import { UserRole } from '../../constants';
// Decorators
import { Auth } from '../../decorators';
// Services
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Auth({ roles: [UserRole.USER] })
  @Get('@me')
  async login(@Request() req) {
    return req.user;
  }
}
