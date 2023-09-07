import { BaseService } from '@libs/common/base';
import { IContextService } from '@libs/common/context';
import { UserServicePort } from './user.service.port';
import { Inject, Injectable } from '@nestjs/common';
import { UserDIToken } from '../../api/di-token';
import { UserRepositoryPort } from '../domain/user.repository.port';
import { User, UserRole } from '../domain/user';
import { PasswordHelper } from 'apps/account/src/auth/infrastructure/utils/password-helper';

@Injectable()
export class UserService extends BaseService<User> implements UserServicePort {
  constructor(
    @Inject(UserDIToken.UserRepository) readonly repo: UserRepositoryPort,
    @Inject(UserDIToken.ContextService)
    readonly contextService: IContextService
  ) {
    super(repo, contextService);
  }

  async beforeCreate(data: User): Promise<void> {
    super.beforeCreate(data);
    data.role = UserRole.User;
    data.active = true;
    data.password = await PasswordHelper.toHash(data.password);
  }
}
