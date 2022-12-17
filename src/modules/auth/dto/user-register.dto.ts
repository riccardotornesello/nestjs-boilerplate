import { IsString, MinLength, IsNotEmpty, IsEmail } from 'class-validator';
import { Unique } from 'src/validators/unique';
import { User } from 'src/modules/user/entities/user.entity';

export class UserRegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Unique(User, 'username')
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  @Unique(User, 'email')
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
