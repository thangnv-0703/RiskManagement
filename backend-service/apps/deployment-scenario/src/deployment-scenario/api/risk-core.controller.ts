import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { HttpAuthGuard } from 'libs/common/src/guard/http.auth.guard';
import { DeploymentScenarioDIToken } from './di-token';
import { RiskCoreServicePort } from '../core/application/interfaces';
import {
  DetectThreatDto,
  InitRiskMonitoringDto,
  StaticAssessment,
} from './dtos';
import { ApiController } from '@libs/common/decorator';

@UseGuards(HttpAuthGuard)
@ApiController('deployment_scenarios', 'Risk core')
export class RiskCoreController {
  constructor(
    @Inject(DeploymentScenarioDIToken.RiskCoreService)
    private readonly service: RiskCoreServicePort
  ) {}

  @Post('/assessment/:id')
  async assess(@Param('id') id: string, @Body() body: StaticAssessment) {
    body.deploymentScenarioId = id;
    const result = await this.service.assess(body);
    return result;
  }

  @Post('/monitoring/:id')
  async monitor(@Param('id') id: string, @Body() body: InitRiskMonitoringDto) {
    body.deploymentScenarioId = id;
    const result = await this.service.monitor(body);
    return result;
  }

  @Post('/detect_threat/:id')
  async detectThreat(@Param('id') id: string, @Body() body: DetectThreatDto) {
    body.deploymentScenarioId = id;
    const result = await this.service.detectThreat(body);
    return result;
  }

  @Post('/scan_vulnerability/:id')
  async scanVulnerability(@Param('id') id: string) {
    const result = await this.service.scanVulnerability(id);
    return result;
  }
}
