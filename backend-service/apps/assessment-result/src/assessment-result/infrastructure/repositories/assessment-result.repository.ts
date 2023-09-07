import { InjectModel } from '@nestjs/mongoose';
import { AssessmentResult } from '../../core/domain/assessment-result';
import { AssessmentResultRepositoryPort } from '../../core/domain/assessment-result.repository.port';
import { BaseRepository } from '@libs/common/base';
import { Model } from 'mongoose';
import { PagingParam, PagingResponse } from '@libs/api-contract';

export class AssessmentResultRepository
  extends BaseRepository<AssessmentResult>
  implements AssessmentResultRepositoryPort
{
  constructor(
    @InjectModel(AssessmentResult.name)
    readonly collection: Model<AssessmentResult>
  ) {
    super(collection);
  }

  async getPagingAssessmentResult(
    param: PagingParam
  ): Promise<PagingResponse<AssessmentResult>> {
    const result = await this.collection
      .find(param.filter)
      .select(
        'result name deploymentScenarioId createdAt createdBy updatedAt updatedBy'
      );

    return {
      data: result,
      total: result.length,
    };
  }

  async getAssessmentResultByName(name: string): Promise<AssessmentResult[]> {
    const filter = {
      name: {
        $regex: `^${name}$`,
        $options: 'i',
      },
    };
    return await this.collection.find(filter);
  }

  async getAssessmentResultDashboard(
    condition: object
  ): Promise<AssessmentResult[]> {
    return await this.collection.find(condition).select('result name');
  }
}
