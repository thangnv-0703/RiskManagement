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

import { PagingQueyDto } from '@libs/api-contract';
import { DeploymentScenarioDIToken } from './di-token';
import { HttpAuthGuard } from 'libs/common/src/guard/http.auth.guard';
import { AssetCveServicePort } from '../core/application/interfaces/asset-cve.service.port';
import {
  CveOnAssetDto,
  CvesOnAssetPagingDto,
  UpdateActiveCveDto,
} from './dtos';
import { Serialize } from '@libs/common/interceptors';

@UseGuards(HttpAuthGuard)
@ApiController('deployment_scenarios', 'Asset cve')
export class AssetCveController {
  constructor(
    @Inject(DeploymentScenarioDIToken.AssetCveService)
    readonly service: AssetCveServicePort
  ) {}

  @Put(':id/assets/:assetsId/cves')
  async updateCveOnAsset(
    @Param('id') id: string,
    @Param('assetsId') assetsId: string,
    @Body() data: any
  ) {
    data.deploymentScenarioId = id;
    data.assetId = assetsId;
    const result = await this.service.updateCveOnAsset(data, false);
    return result;
  }

  @Serialize(CveOnAssetDto)
  @Get(':id/assets/:assetsId/cves')
  async getPagingCveOnAsset(
    @Param('id') id: string,
    @Param('assetsId') assetsId: string,
    @Query() queryParams: PagingQueyDto
  ) {
    const data: CvesOnAssetPagingDto = {
      deploymentScenarioId: id,
      assetId: assetsId,
      paging: queryParams,
    };
    const result = await this.service.getCveOnAsset(data);
    return result;
  }

  @Serialize(CveOnAssetDto)
  @Get(':id/attack_graph/assets/:assetId/cves')
  async getActiveCve(
    @Param('id') id: string,
    @Param('assetId') assetId: string,
    @Query() queryParams: PagingQueyDto
  ) {
    const data: CvesOnAssetPagingDto = {
      deploymentScenarioId: id,
      assetId: assetId,
      paging: queryParams,
    };
    return await this.service.getActiveCve(data);
  }

  @Post(':id/attack_graph/assets/:assetId/cves')
  async updateActiveCve(
    @Param('id') id: string,
    @Param('assetId') assetId: string,
    @Body() data: UpdateActiveCveDto
  ) {
    data.assetId = assetId;
    data.deploymentScenarioId = id;
    return this.service.updateActiveCve(data);
  }
}
