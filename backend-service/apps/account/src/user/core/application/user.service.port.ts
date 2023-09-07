import { BaseServicePort } from '@libs/common/base';
import { User } from '../domain/user';

export interface UserServicePort extends BaseServicePort<User> {}
