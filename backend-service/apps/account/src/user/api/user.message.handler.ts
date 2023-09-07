import { Controller, Inject } from '@nestjs/common';
import { UserDIToken } from './di-token';
import { MessagePattern } from '@nestjs/microservices';
import { UserServicePort } from '../core/application/user.service.port';
import { User } from '../core/domain/user';
import { AccountPattern, PagingParam } from '@libs/api-contract';

@Controller('user')
export class UserMessageHandler {
  constructor(
    @Inject(UserDIToken.UserService) readonly service: UserServicePort
  ) {}

  @MessagePattern(AccountPattern.GetPaging)
  async getPaging(param: PagingParam) {
    const result = await this.service.getPaging(param);
    return result;
  }

  @MessagePattern(AccountPattern.Create)
  async create(data: User) {
    const result = await this.service.create(data);
    return result;
  }

  @MessagePattern(AccountPattern.Update)
  async update(data: User) {
    const result = await this.service.update(data);
    return result;
  }
}
