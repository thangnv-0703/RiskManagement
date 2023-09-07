import { InjectModel } from '@nestjs/mongoose';
import { FactorAssessment } from '../../core/domain/factor-assessment';
import { FactorAssessmentRepositoryPort } from '../../core/domain/factor-assessment.repository.port';
import { BaseRepository } from '@libs/common/base';
import { Model } from 'mongoose';

export class FactorAssessmentRepository
  extends BaseRepository<FactorAssessment>
  implements FactorAssessmentRepositoryPort
{
  constructor(
    @InjectModel(FactorAssessment.name)
    readonly collection: Model<FactorAssessment>
  ) {
    super(collection);
  }

  async getFactorAssessmentByName(name: string): Promise<FactorAssessment[]> {
    const filter = {
      name: {
        $regex: `^${name}$`,
        $options: 'i',
      },
    };
    return await this.collection.find(filter);
  }
}
