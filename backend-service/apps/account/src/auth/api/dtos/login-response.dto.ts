import { Expose } from 'class-transformer';
import { CurrentUser } from './current-user';

export class LoginResponseDto {
  @Expose()
  token: string;

  @Expose()
  user: CurrentUser;
}
