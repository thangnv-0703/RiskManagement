import { BaseRepositoryPort } from '@libs/common/base';
import { User } from './user';

export interface UserRepositoryPort extends BaseRepositoryPort<User> {
  findByEmail(email: string): Promise<User>;
}
