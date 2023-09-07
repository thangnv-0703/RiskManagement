import { InjectModel } from '@nestjs/mongoose';
import { UserRepositoryPort } from '../../core/domain/user.repository.port';
import { User } from '../../core/domain/user';
import { Model } from 'mongoose';
import { BaseRepository } from '@libs/common/base';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository
  extends BaseRepository<User>
  implements UserRepositoryPort
{
  constructor(@InjectModel(User.name) readonly collection: Model<User>) {
    super(collection);
  }
  async findByEmail(email: string): Promise<User> {
    return this.collection.findOne({ email: email });
  }
}
