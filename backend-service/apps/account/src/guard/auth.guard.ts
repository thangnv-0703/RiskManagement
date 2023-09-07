import {
  CanActivate,
  ExecutionContext,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { AuthDIToken } from '../auth/api/di-token';
import { AuthServicePort } from '../auth/core/application/auth.service.port';
import { CustomRpcException } from '@libs/common/exception-filters';

export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AuthDIToken.AuthService)
    private readonly service: AuthServicePort
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token: string = request.headers['authorization']?.split(' ')[1];

    const user = await this.service.getCurrentUser(token);
    if (!user) {
      throw new CustomRpcException({
        message: 'Unauthorized',
        status: HttpStatus.UNAUTHORIZED,
      });
    }
    request.user = user;

    return true;
  }
}
