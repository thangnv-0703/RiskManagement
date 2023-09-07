import { BaseServicePort } from '@libs/common/base';
import { AssessmentResult } from '../domain/assessment-result';

export interface AssessmentResultServicePort
  extends BaseServicePort<AssessmentResult> {
  getAssessmentResultDashboard(userId: string): Promise<AssessmentResult[]>;
}
