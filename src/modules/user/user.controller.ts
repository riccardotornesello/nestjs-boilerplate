import { ApiSecurity } from '@nestjs/swagger';
import { Controller, Get, Request } from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { UserService } from './user.service';
import { UserRole } from '../../constants';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiSecurity('bearer')
  @Auth({ roles: [UserRole.USER] })
  @Get('@me')
  async login(@Request() req) {
    return req.user;
  }
}
