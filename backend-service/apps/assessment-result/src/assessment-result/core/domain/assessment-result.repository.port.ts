import { BaseRepositoryPort } from '@libs/common/base';
import { AssessmentResult } from './assessment-result';
import { PagingParam, PagingResponse } from '@libs/api-contract';

export interface AssessmentResultRepositoryPort
  extends BaseRepositoryPort<AssessmentResult> {
  getAssessmentResultByName(name: string): Promise<AssessmentResult[]>;
  getPagingAssessmentResult(
    param: PagingParam
  ): Promise<PagingResponse<AssessmentResult>>;

  getAssessmentResultDashboard(condition: object): Promise<AssessmentResult[]>;
}
