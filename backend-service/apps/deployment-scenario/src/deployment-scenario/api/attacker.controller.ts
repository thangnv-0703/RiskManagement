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
import { AttackerServicePort } from '../core/application/interfaces';
import { AttackerDto, CreateAttackerDto, UpdateAttackerDto } from './dtos';
import { HttpAuthGuard } from 'libs/common/src/guard/http.auth.guard';

@UseGuards(HttpAuthGuard)
@Serialize(AttackerDto)
@ApiController('deployment_scenarios', 'Attacker')
export class AttackerController {
  constructor(
    @Inject(DeploymentScenarioDIToken.AttackerService)
    readonly service: AttackerServicePort
  ) {}

  @Get(':id/attackers')
  getPagingAttacker(
    @Param('id') id: string,
    @Query() queryParams: PagingQueyDto
  ) {
    queryParams.filter = {
      deploymentScenarioId: id,
    };
    const result = this.service.getPaging(queryParams);
    return result;
  }

  @Post(':id/attackers')
  async createAttacker(
    @Body() data: CreateAttackerDto,
    @Param('id') id: string
  ) {
    data.deploymentScenario = id;
    return this.service.create(data);
  }

  @Put(':id/attackers/:attackerId')
  async updateAttacker(
    @Body() data: UpdateAttackerDto,
    @Param('attackerId') attackerId: string
  ) {
    data.id = attackerId;
    return this.service.update(data);
  }

  @Delete(':id/attackers/:id')
  async deleteAttacker(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
