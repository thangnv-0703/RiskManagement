import { AccountPattern } from '@libs/api-contract';
import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthServicePort } from '../core/application/auth.service.port';
import { AuthDIToken } from './di-token';

@Controller()
export class AuthMessageHandler {
  constructor(
    @Inject(AuthDIToken.AuthService) private service: AuthServicePort
  ) {}

  @MessagePattern(AccountPattern.CurrentUser)
  async getCurrentUser(data: string) {
    const result = await this.service.getCurrentUser(data);
    return result;
  }
}
