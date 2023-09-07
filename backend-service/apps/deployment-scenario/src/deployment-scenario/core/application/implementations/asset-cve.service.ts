import { BaseService } from '@libs/common/base';
import { IContextService } from '@libs/common/context';
import { CustomRpcException } from '@libs/common/exception-filters';
import { HttpStatus, Inject } from '@nestjs/common';
import { AssetCve, DeploymentScenario } from '../../domain/documents';
import { DeploymentScenarioDIToken } from '../../../api/di-token';
import { AssetCveServicePort } from '../interfaces/asset-cve.service.port';
import {
  AssetCveRepositoryPort,
  DeploymentScenarioRepositoryPort,
} from '../../domain/interfaces';
import {
  UpdateCveOnAsset,
  CvesOnAssetPagingDto,
  UpdateActiveCveDto,
} from '../../../api/dtos';
import { CveOnAsset } from 'apps/deployment-scenario/src/deployment-scenario/core/domain/sub-documents';
import mongoose from 'mongoose';
import { PagingResponse } from '@libs/api-contract';
import { DeploymentScenarioServicePort } from '../interfaces';

export class AssetCveService
  extends BaseService<AssetCve>
  implements AssetCveServicePort
{
  constructor(
    @Inject(DeploymentScenarioDIToken.AssetCveRepository)
    readonly repo: AssetCveRepositoryPort,
    @Inject(DeploymentScenarioDIToken.DeploymentScenarioService)
    readonly deploymentScenarioService: DeploymentScenarioServicePort,
    @Inject(DeploymentScenarioDIToken.DeploymentScenarioRepository)
    readonly deploymentScenarioRepo: DeploymentScenarioRepositoryPort,
    @Inject(DeploymentScenarioDIToken.ContextService)
    readonly contextService: IContextService
  ) {
    super(repo, contextService);
    this.checkCreatedBy = false;
  }

  async updateCveOnAsset(
    data: UpdateCveOnAsset,
    udpateActive: boolean
  ): Promise<boolean> {
    const deploymentScenario = await this.deploymentScenarioService.getById(
      data.deploymentScenarioId
    );

    const asset = deploymentScenario.assets.find(
      (asset) => asset.id === data.assetId
    );
    if (asset) {
      const cves: CveOnAsset[] = data.cves?.map((cve) => {
        return {
          ...cve,
          condition: udpateActive ? cve?.condition[asset.part] : cve?.condition,
        };
      });
      const assetCve: Partial<AssetCve> = {
        deploymentScenario: data.deploymentScenarioId,
        assetId: data.assetId,
        cves: cves,
      };

      if (udpateActive) {
        assetCve.active = [];
        await this.repo.deleteMany(
          this.getFilter(data.deploymentScenarioId, data.assetId)
        );
      }
      const filter = this.getFilter(
        assetCve.deploymentScenario,
        assetCve.assetId
      );

      const result = await this.repo.upsertAssetCve(filter, assetCve);
      await this.updateDeploymentScenario(deploymentScenario, result);
      return true;
    }

    return false;
  }

  async updateDeploymentScenario(
    deploymentScenaio: DeploymentScenario,
    assetCve: AssetCve
  ): Promise<void> {
    const cveId = deploymentScenaio.cves.find(
      (cve) => cve.toJSON() === assetCve.id
    );
    if (!cveId) {
      await this.deploymentScenarioRepo.updateCve(
        deploymentScenaio.id,
        assetCve.id
      );
    }
  }

  async getCveOnAsset(
    data: CvesOnAssetPagingDto
  ): Promise<PagingResponse<CveOnAsset>> {
    await this.deploymentScenarioService.getById(data.deploymentScenarioId);
    const filter = this.getFilter(data.deploymentScenarioId, data.assetId);
    const assetCves = await this.repo.findByCondition(filter);
    const result: PagingResponse<CveOnAsset> = {
      data: assetCves ? assetCves[0].cves : [],
      total: assetCves ? assetCves[0].cves.length : 0,
    };
    return result;
  }

  async getActiveCve(
    param: CvesOnAssetPagingDto
  ): Promise<PagingResponse<CveOnAsset>> {
    await this.deploymentScenarioService.getById(param.deploymentScenarioId);
    const filter = this.getFilter(param.deploymentScenarioId, param.assetId);
    const assetCves = await this.repo.findByCondition(filter);
    const assetCve = assetCves.length > 0 ? assetCves[0] : null;
    const activeCves = assetCve.cves.filter((cve) =>
      assetCve.active.includes(cve.cve_id)
    );
    return {
      data: activeCves,
      total: activeCves.length,
    };
  }

  async updateActiveCve(param: UpdateActiveCveDto): Promise<boolean> {
    const deploymentScenario = await this.deploymentScenarioService.getById(
      param.deploymentScenarioId
    );
    const filter = this.getFilter(param.deploymentScenarioId, param.assetId);
    const result = await this.repo.updateMany(filter, { active: param.cves });
    if (!result) {
      throw new CustomRpcException({
        message: 'Update active cve failed',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    this.deploymentScenarioRepo.updateEmptyAttackGraph(deploymentScenario.id);
    return result;
  }

  private getFilter(deploymentScenarioId: string, assetId: string): object {
    const filter = {
      assetId: assetId,
      deploymentScenario: new mongoose.Types.ObjectId(deploymentScenarioId),
    };
    return filter;
  }
}
