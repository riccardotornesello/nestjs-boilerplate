// NestJS
import { Controller, Get, Request } from '@nestjs/common';

// Decorators
import { Auth } from '../../decorators';

// Services
import { UserService } from './user.service';

// Constants
import { UserRole } from '../../constants';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Auth({ roles: [UserRole.USER] })
  @Get('@me')
  async login(@Request() req) {
    return req.user;
  }
}
