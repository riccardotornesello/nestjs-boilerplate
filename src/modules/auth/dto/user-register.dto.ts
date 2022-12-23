import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';
import { Unique } from 'src/validators/unique';

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
