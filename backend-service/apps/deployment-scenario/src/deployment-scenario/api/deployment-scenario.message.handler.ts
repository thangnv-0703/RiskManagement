import {
  CategoryPattern,
  DeploymentScenarioPattern,
  PagingParam,
  ServiceParam,
} from '@libs/api-contract';
import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { DeploymentScenarioDIToken } from './di-token';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { DeploymentScenarioServicePort } from '../core/application/interfaces';
import { DeploymentScenario } from '../core/domain/documents';
import { UpdateAssetCpeDto, UpdateCveOnAsset } from './dtos';
import { AssetCveServicePort } from '../core/application/interfaces/asset-cve.service.port';
import { IContextService } from '@libs/common/context';
import { CveOnAsset } from '../core/domain/sub-documents';
import { firstValueFrom } from 'rxjs';
import { CheckContextInterceptor } from '@libs/common/interceptors';

@UseInterceptors(CheckContextInterceptor)
@Controller()
export class DeploymentScenarioMessageHandler {
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

  @MessagePattern(DeploymentScenarioPattern.GetPagingDeploymentScenario)
  async getPaging(param: ServiceParam<PagingParam>) {
    const result = await this.service.getPaging(param.data);
    return result;
  }

  @MessagePattern(DeploymentScenarioPattern.GetByIdDeploymentScenario)
  async getById(param: ServiceParam<string>) {
    const result = await this.service.getById(param.data);
    return result;
  }

  @MessagePattern(DeploymentScenarioPattern.CreateDeploymentScenario)
  async create(param: ServiceParam<DeploymentScenario>) {
    const result = await this.service.createDeploymentScenario(param.data);
    return result;
  }

  @MessagePattern(DeploymentScenarioPattern.UpdateDeploymentScenario)
  async update(param: ServiceParam<DeploymentScenario>) {
    const result = await this.service.update(param.data);
    return result;
  }

  @MessagePattern(DeploymentScenarioPattern.DeleteDeploymentScenario)
  async delete(param: ServiceParam<string>) {
    const result = await this.service.delete(param.data);
    return result;
  }

  @MessagePattern(DeploymentScenarioPattern.AssignCpeToAsset)
  async updateAssetCpe(param: ServiceParam<UpdateAssetCpeDto>) {
    await this.service.updateAssetCpe(param.data);
    const payload: ServiceParam<string> = {
      context: this.contextService.getContext(),
      data: param.data.cpe,
    };
    const result = await firstValueFrom(
      this.categoryClient.send<CveOnAsset[], ServiceParam<string>>(
        CategoryPattern.MappingCVE,
        payload
      )
    );
    const updateData: UpdateCveOnAsset = {
      assetId: param.data.id,
      deploymentScenarioId: param.data.deploymentScenarioId,
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

  @MessagePattern(DeploymentScenarioPattern.GetAssetActiveCve)
  async getAssetActiveCve(param: ServiceParam<string>) {
    const result = await this.service.getAssetActiveCve(param.data);
    return {
      data: result,
      total: result.assets.length,
    };
  }

  @MessagePattern(DeploymentScenarioPattern.GetAttackGraph)
  async getAttackGraph(param: ServiceParam<string>) {
    return await this.service.getAttackGraph(param.data);
  }

  @MessagePattern(DeploymentScenarioPattern.SaveAttackGraph)
  async saveAttackGraph(param: ServiceParam<DeploymentScenario>) {
    return await this.service.saveAttackGraph(param.data);
  }

  @MessagePattern(DeploymentScenarioPattern.GetAssetCveOnAttackGraph)
  async getAssetCveOnAttackGraph(param: ServiceParam<string>) {
    return await this.service.getAssetCveOnAttackGraph(param.data);
  }

  @MessagePattern(DeploymentScenarioPattern.GetDeploymentScenarioDashboard)
  async getDashboardData(param: ServiceParam<string>) {
    const result = await this.service.getDeploymentScenarioDashboard(
      param.data
    );
    return {
      data: result,
      total: result.length,
    };
  }
}
