import { ApiController } from '@libs/common/decorator';
import {
  Body,
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
import { DeploymentScenarioDIToken } from './di-token';
import { AppliedCountermeasureServicePort } from '../core/application/interfaces';
import {
  AppliedCountermeasureDto,
  CreateAppliedCountermeasureDto,
  UpdateAppliedCountermeasureDto,
} from './dtos';
import { HttpAuthGuard } from 'libs/common/src/guard/http.auth.guard';

@UseGuards(HttpAuthGuard)
@Serialize(AppliedCountermeasureDto)
@ApiController('deployment_scenarios', 'Applied Countermeasure')
export class AppliedCountermeasureController {
  constructor(
    @Inject(DeploymentScenarioDIToken.AppliedCountermeasureService)
    readonly service: AppliedCountermeasureServicePort
  ) {}

  @Get(':id/countermeasures')
  getPagingAppliedCountermeasure(
    @Param('id') id: string,
    @Query() queryParams: PagingQueyDto
  ) {
    queryParams.filter = {
      deploymentScenarioId: id,
    };
    const result = this.service.getPaging(queryParams);
    return result;
  }

  @Post(':id/countermeasures')
  async createAppliedCountermeasure(
    @Body() data: CreateAppliedCountermeasureDto,
    @Param('id') id: string
  ) {
    data.deploymentScenario = id;
    return this.service.create(data);
  }

  @Put(':id/countermeasures/:attackerId')
  async updateAppliedCountermeasure(
    @Body() data: UpdateAppliedCountermeasureDto,
    @Param('attackerId') attackerId: string
  ) {
    data.id = attackerId;
    return this.service.update(data);
  }

  @Delete(':id/countermeasures/:id')
  async deleteAppliedCountermeasure(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
