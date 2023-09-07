import { BaseServicePort } from '@libs/common/base';
import { FactorAssessment } from '../domain/factor-assessment';
import { AssessmentConfigDto } from '../../api/dtos/config-assessment.dto';

export interface FactorAssessmentServicePort
  extends BaseServicePort<FactorAssessment> {
  getFactorAssessment(deploymentScenarioId: string): Promise<FactorAssessment>;
  saveFactorAssessment(config: FactorAssessment): Promise<boolean>;
  getConfigAssessment(
    deploymentScenarioId: string
  ): Promise<AssessmentConfigDto>;
}
