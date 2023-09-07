import {
  DetectThreatDto,
  InitRiskMonitoringDto,
  StaticAssessment,
} from '../../../api/dtos';

export interface RiskCoreServicePort {
  assess(data: StaticAssessment): Promise<any>;

  assessForSave(id: string): Promise<any>;

  monitor(data: InitRiskMonitoringDto): Promise<any>;

  detectThreat(data: DetectThreatDto): Promise<any>;

  scanVulnerability(id: string): Promise<any>;
}
