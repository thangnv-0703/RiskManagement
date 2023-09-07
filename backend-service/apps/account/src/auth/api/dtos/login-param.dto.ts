import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginParamDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
