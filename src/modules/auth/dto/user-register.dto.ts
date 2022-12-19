import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNotEmpty, IsEmail } from 'class-validator';
import { Unique } from 'src/validators/unique';
import { User } from 'src/modules/user/entities/user.entity';

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
