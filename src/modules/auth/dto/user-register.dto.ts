import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserRegisterDto {
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
