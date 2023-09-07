import { ApiController } from '@libs/common/decorator';
import { HttpAuthGuard } from '@libs/common/guard';
import { Body, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { FactorAssessmentServicePort } from '../core/application/factor-assessment.service.port';
import { FactorAssessmentDIToken } from './di-token';
import { FactorAssessmentDto, SaveFactorAssessmentDto } from './dtos';
import { FactorAssessment } from '../core/domain/factor-assessment';
import { Serialize } from '@libs/common/interceptors';

@UseGuards(HttpAuthGuard)
@ApiController('supplement_apt_risk', 'Factor Assessment')
export class FactorAssessmentController {
  constructor(
    @Inject(FactorAssessmentDIToken.FactorAssessmentService)
    readonly service: FactorAssessmentServicePort
  ) {}

  @Serialize(FactorAssessmentDto)
  @Get('/factor/:deploymentScenarioId')
  getFactorAssessment(
    @Param('deploymentScenarioId') deploymentScenarioId: string
  ) {
    return this.service.getFactorAssessment(deploymentScenarioId);
  }

  @Post('/factor/:deploymentScenarioId')
  saveFactorAssessment(
    @Param('deploymentScenarioId') deploymentScenarioId: string,
    @Body() data: SaveFactorAssessmentDto
  ) {
    data.deploymentScenarioId = deploymentScenarioId;
    return this.service.saveFactorAssessment(
      data as unknown as FactorAssessment
    );
  }
}
