import { Controller, Get, Request } from '@nestjs/common';

import { UserRole } from '../../../constants';
import { Auth } from '../../../decorators';
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
