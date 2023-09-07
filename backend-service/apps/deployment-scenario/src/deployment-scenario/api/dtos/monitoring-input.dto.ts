import { ConfigAssessmentDto } from './config-assessment.dto';
import { DeploymentScenarioDto } from './deployment-scenario.dto';
import { InitRiskMonitoringDto } from './init-risk-monitoring.dto';

class Factor {
  type: string;
  weight: number;
  score: number;
  state: number;
}

export class MonitoringInputDto {
  deploymentScenario: DeploymentScenarioDto;
  supplementConfig: ConfigAssessmentDto;
  monitorParam: InitRiskMonitoringDto;
}
