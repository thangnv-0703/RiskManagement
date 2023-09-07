import { ConfigAssessmentDto } from './config-assessment.dto';
import { DeploymentScenarioDto } from './deployment-scenario.dto';

export class AssessmentInputDto {
  deploymentScenario: DeploymentScenarioDto;
  supplementConfig: ConfigAssessmentDto;
}
