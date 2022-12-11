import { IsString } from 'class-validator';

export class UserCredentialsDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;
}
