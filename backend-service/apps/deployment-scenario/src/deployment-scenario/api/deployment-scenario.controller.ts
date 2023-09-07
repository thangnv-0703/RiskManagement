import { firstValueFrom } from 'rxjs';
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

import {
  CategoryPattern,
  DeploymentScenarioPattern,
  PagingQueyDto,
  ServiceParam,
} from '@libs/api-contract';
import { DeploymentScenarioDIToken } from './di-token';
import { DeploymentScenarioServicePort } from '../core/application/interfaces';
import { AssetCveServicePort } from '../core/application/interfaces/asset-cve.service.port';
import { ClientProxy } from '@nestjs/microservices';
import { IContextService } from '@libs/common/context';
import {
  CpeDto,
  CpeMappingDto,
  CreateDeploymentScenarioDto,
  SaveAttackGraphDto,
  UpdateCveOnAsset,
  UpdateDeploymentScenarioDto,
  DeploymentScenarioDto,
  DeploymentScenarioListDto,
  AssetActiveCveDto,
  AttackGraphDto,
  GetAttackGraphDto,
  AssetCveOnAttackGraph,
} from './dtos';
import { HttpAuthGuard } from 'libs/common/src/guard/http.auth.guard';
import { DeploymentScenario } from '../core/domain/documents';
import { UpdateAssetCpeDto } from './dtos/update-asset-cpe.dto';
import { CveOnAsset } from '../core/domain/sub-documents';
import { GraphService } from '../../attack-graph/graph-service';

@UseGuards(HttpAuthGuard)
@ApiController('deployment_scenarios', 'Deployment Scenario')
export class DeploymentScenarioController {
  constructor(
    @Inject(DeploymentScenarioDIToken.DeploymentScenarioService)
    readonly service: DeploymentScenarioServicePort,
    @Inject(DeploymentScenarioDIToken.AssetCveService)
    readonly assetCveService: AssetCveServicePort,
    @Inject(DeploymentScenarioDIToken.CategoryClientProxy)
    readonly categoryClient: ClientProxy,
    @Inject(DeploymentScenarioDIToken.AssetManagementClientProxy)
    readonly assetManagementClient: ClientProxy,
    @Inject(DeploymentScenarioDIToken.ContextService)
    readonly contextService: IContextService
  ) {}

  @Get('mapping_cpe')
  async getMappingCpe(@Query('keyword') keyword: string) {
    const context = this.contextService.getContext();
    const payload: ServiceParam<string> = {
      context: context,
      data: keyword,
    };
    const result = await firstValueFrom(
      this.categoryClient.send<CpeDto[], ServiceParam<string>>(
        CategoryPattern.MappingCPE,
        payload
      )
    );
    const mappingCpes = result.map((cpe) => {
      return new CpeMappingDto(cpe.name);
    });
    return {
      cpes: mappingCpes,
      status: true,
    };
  }

  @Get('')
  @Serialize(DeploymentScenarioListDto)
  getPaging(@Query() queryParams: PagingQueyDto) {
    const result = this.service.getPaging(queryParams);
    return result;
  }

  @Get(':id')
  @Serialize(DeploymentScenarioDto)
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  @Serialize(DeploymentScenarioDto)
  async create(@Body() data: CreateDeploymentScenarioDto) {
    return this.service.createDeploymentScenario(
      data as unknown as DeploymentScenario
    );
  }

  @Put(':id')
  @Serialize(DeploymentScenarioDto)
  async update(
    @Body() data: UpdateDeploymentScenarioDto,
    @Param('id') id: string
  ) {
    data.id = id;
    return this.service.update(data);
  }

  @Delete(':id')
  @Serialize(DeploymentScenarioDto)
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Serialize(GetAttackGraphDto)
  @Get(':id/attack_graph')
  async getAttackGraph(@Param('id') id: string) {
    const result = await this.service.getAttackGraph(id);
    return result;
  }

  @Serialize(SaveAttackGraphDto)
  @Post(':id/attack_graph')
  async saveAttackGraph(
    @Param('id') id: string,
    @Body() data: SaveAttackGraphDto
  ) {
    data.id = id;
    return this.service.saveAttackGraph(data as unknown as DeploymentScenario);
  }

  @Serialize(AssetCveOnAttackGraph)
  @Get(':id/monitoring/attack_graph_cve')
  async getAttackGraphCve(@Param('id') id: string) {
    return this.service.getAssetCveOnAttackGraph(id);
  }

  @Serialize(AssetActiveCveDto)
  @Get(':id/assets')
  async getAssetActiveCve(@Param('id') id: string) {
    const result = await this.service.getAssetActiveCve(id);
    return {
      data: result,
      total: result.assets.length,
    };
  }

  @Post('generate_coordinates')
  async generateCoordinates(@Body() data: any) {
    const result = GraphService.generateCoordinates(data.graph);
    return {
      data: {
        graph: result,
      },
    };
  }

  @Put(':id/assets/:assetsId')
  async asignCpeToAsset(
    @Param('id') id: string,
    @Body() data: UpdateAssetCpeDto
  ) {
    data.deploymentScenarioId = id;
    await this.service.updateAssetCpe(data);
    const payload: ServiceParam<string> = {
      context: this.contextService.getContext(),
      data: data.cpe,
    };
    const result = await firstValueFrom(
      this.categoryClient.send<CveOnAsset[], ServiceParam<string>>(
        CategoryPattern.MappingCVE,
        payload
      )
    );
    const updateData: UpdateCveOnAsset = {
      assetId: data.id,
      deploymentScenarioId: data.deploymentScenarioId,
      cves: result,
    };
    await this.assetCveService.updateCveOnAsset(updateData, true);
    const payloadData: ServiceParam<UpdateCveOnAsset> = {
      context: this.contextService.getContext(),
      data: updateData,
    };
    this.assetManagementClient.emit(
      DeploymentScenarioPattern.AssignCveOnAsset,
      payloadData
    );
    return true;
  }
}
