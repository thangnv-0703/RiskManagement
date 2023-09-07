import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordHelper } from '../../infrastructure/utils/password-helper';
import { CustomRpcException } from '@libs/common/exception-filters';
import { AuthServicePort } from './auth.service.port';
import { UserRepositoryPort } from 'apps/account/src/user/core/domain/user.repository.port';
import { AuthDIToken } from '../../api/di-token';
import { CurrentUser, LoginResponseDto } from '../../api/dtos';

@Injectable()
export class AuthService implements AuthServicePort {
  constructor(
    @Inject(AuthDIToken.UserRepository) private userRepo: UserRepositoryPort,
    private jwtService: JwtService
  ) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const exitingUser = await this.userRepo.findByEmail(email);

    if (!exitingUser) {
      throw new CustomRpcException({
        message: 'Invalid credentials email',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const passwordMatch = await PasswordHelper.comparePassword(
      exitingUser.password,
      password
    );
    if (!passwordMatch) {
      throw new CustomRpcException({
        message: 'Invalid credentials password',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const currentUser: CurrentUser = {
      id: exitingUser.id,
      email: exitingUser.email,
      role: exitingUser.role,
      active: exitingUser.active,
    };

    const token = await this.getToken(currentUser);
    const response: LoginResponseDto = {
      token: token,
      user: currentUser,
    };
    return response;
  }

  async getToken(user: CurrentUser): Promise<string> {
    return this.jwtService.sign(user);
  }

  async getCurrentUser(token: string): Promise<CurrentUser> {
    try {
      const user = this.jwtService.verify(token) as CurrentUser;
      return user;
    } catch (e) {
      throw new CustomRpcException({
        message: 'Unauthorized',
        status: HttpStatus.UNAUTHORIZED,
      });
    }
  }
}
