import { IsNotEmpty } from 'class-validator';

export class UserCredentialsDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;
}
