import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@libs/common/base';
import { Model } from 'mongoose';
import { Attacker } from '../../core/domain/documents';
import { AttackerRepositoryPort } from '../../core/domain/interfaces';

export class AttackerRepository
  extends BaseRepository<Attacker>
  implements AttackerRepositoryPort
{
  constructor(
    @InjectModel(Attacker.name)
    readonly collection: Model<Attacker>
  ) {
    super(collection);
  }
}
