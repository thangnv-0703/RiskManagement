import { InjectModel } from '@nestjs/mongoose';
import { SystemProfile } from '../../core/domain/system-profile';
import { SystemProfileRepositoryPort } from '../../core/domain/system-profile.repository.port';
import { BaseRepository } from '@libs/common/base';
import { Model } from 'mongoose';

export class SystemProfileRepository
  extends BaseRepository<SystemProfile>
  implements SystemProfileRepositoryPort
{
  constructor(
    @InjectModel(SystemProfile.name) readonly collection: Model<SystemProfile>
  ) {
    super(collection);
  }
}
