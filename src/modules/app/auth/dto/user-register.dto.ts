import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { Unique } from '../../../shared/validation/validators/unique';
import { User } from '../../user/entities/user.entity';

export class UserRegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Unique(User, 'username')
  readonly username: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Unique(User, 'email')
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
