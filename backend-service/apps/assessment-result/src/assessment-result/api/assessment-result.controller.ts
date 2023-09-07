import { HttpAuthGuard } from '@libs/common/guard';
import { ApiController } from '@libs/common/decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from '@libs/common/interceptors';
import { PagingQueyDto } from '@libs/api-contract';
import {
  AssessmentResultDto,
  AssessmentResultListDto,
  SaveAssessmentResultDto,
} from './dtos';
import { AssessmentResultDIToken } from './di-token';
import { AssessmentResultServicePort } from '../core/application/assessment-result.service.port';
import { AssessmentResult } from '../core/domain/assessment-result';

@Serialize(AssessmentResultDto)
@UseGuards(HttpAuthGuard)
@ApiController('assessment_result', 'Assessment Result')
export class AssessmentResultController {
  constructor(
    @Inject(AssessmentResultDIToken.AssessmentResultService)
    readonly service: AssessmentResultServicePort
  ) {}

  @Serialize(AssessmentResultListDto)
  @Get('deployment_scenarios/:deploymentScenarioId')
  getPaging(
    @Param('deploymentScenarioId') deploymentScenarioId: string,
    @Query() queryParams: PagingQueyDto
  ) {
    queryParams.filter = {
      deploymentScenarioId: deploymentScenarioId,
    };
    const result = this.service.getPaging(queryParams);
    return result;
  }

  // @Serialize(AssessmentResultDto)
  @Get(':id')
  async getById(@Param('id') id: string) {
    const result = await this.service.getById(id);
    return result;
  }

  /* Creating a new entity. */
  @Post('deployment_scenarios/:deploymentScenarioId')
  async create(
    @Param('deploymentScenarioId') deploymentScenarioId: string,
    @Body() data: SaveAssessmentResultDto
  ) {
    data.deploymentScenarioId = deploymentScenarioId;
    return this.service.create(data as unknown as AssessmentResult);
  }

  /* A delete method that takes an id as a parameter and deletes the entity with that id. */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
