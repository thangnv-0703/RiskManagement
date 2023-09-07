import { CurrentUser, LoginResponseDto } from '../../api/dtos';

export interface AuthServicePort {
  login(email: string, password: string): Promise<LoginResponseDto>;

  getToken(user: CurrentUser): Promise<string>;

  getCurrentUser(token: string): Promise<CurrentUser>;
}
