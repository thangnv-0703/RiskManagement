import { BaseService } from '@libs/common/base';
import { CustomRpcException } from '@libs/common/exception-filters';
import { IContextService } from '@libs/common/context';
import { HttpStatus, Inject } from '@nestjs/common';
import { DeploymentScenarioDIToken } from '../../../api/di-token';
import { DeploymentScenario } from '../../domain/documents';
import { DeploymentScenarioServicePort } from '../interfaces/deployment-scenario.service.port';
import { DeploymentScenarioRepositoryPort } from '../../domain/interfaces/deployment-scenario.repository.port';
import mongoose from 'mongoose';
import {
  AppliedCountermeasureRepositoryPort,
  AssetCveRepositoryPort,
  AttackerRepositoryPort,
} from '../../domain/interfaces';
import {
  CveOnAttackGraphDto,
  GetAssetActiveCveDto,
  GetAttackGraphDto,
  UpdateAssetCpeDto,
} from '../../../api/dtos';
import { DeploymentScenarioPublisherPort } from '../../domain/interfaces/deployment-scenario.publisher.port';
import { SystemProfileDto } from '../../../api/dtos/system-profile.dto';
import { GraphService } from 'apps/deployment-scenario/src/attack-graph/graph-service';
import { AttackGraph } from '../../domain/sub-documents';
import { Graph } from 'apps/deployment-scenario/src/attack-graph/models/graph';
import {
  DeploymentScenarioStatus,
  ExploitabilityCVSS,
  RemediationLevelCVSS,
  ReportConfidenceCVSS,
} from '../../domain/enums';

export class DeploymentScenarioService
  extends BaseService<DeploymentScenario>
  implements DeploymentScenarioServicePort
{
  constructor(
    @Inject(DeploymentScenarioDIToken.DeploymentScenarioRepository)
    readonly repo: DeploymentScenarioRepositoryPort,
    @Inject(DeploymentScenarioDIToken.AppliedCountermeasureRepository)
    readonly countermeasureRepo: AppliedCountermeasureRepositoryPort,
    @Inject(DeploymentScenarioDIToken.AttackerRepository)
    readonly attackerRepo: AttackerRepositoryPort,
    @Inject(DeploymentScenarioDIToken.DeploymentScenarioPublisher)
    readonly deploymentScenarioPublisher: DeploymentScenarioPublisherPort,
    @Inject(DeploymentScenarioDIToken.AssetCveRepository)
    readonly assetCveRepository: AssetCveRepositoryPort,
    @Inject(DeploymentScenarioDIToken.ContextService)
    readonly contextService: IContextService
  ) {
    super(repo, contextService);
  }
  async getAttackGraph(id: string): Promise<GetAttackGraphDto> {
    const deploymentScenario = await this.getById(id);

    if (deploymentScenario.attackers.length === 0) {
      throw new CustomRpcException({
        message: 'Please setup attacker ',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    for (const assetCve of deploymentScenario.cves) {
      for (const cve of assetCve.cves) {
        if (
          assetCve.active.includes(cve.cve_id) &&
          (cve.condition['preCondition'] === '' ||
            cve.condition['postCondition'] === '' ||
            cve.attackVector === '')
        ) {
          throw new CustomRpcException({
            message: 'please set up all value of CVE on Asset',
            status: HttpStatus.UNPROCESSABLE_ENTITY,
          });
        }
      }
    }

    let attackGraph: AttackGraph;
    let graph: Graph;
    if (
      deploymentScenario.attackGraph.nodes.length > 0 &&
      deploymentScenario.attackGraph.edges.length > 0
    ) {
      attackGraph = deploymentScenario.attackGraph;
    } else {
      graph = GraphService.generateAttackGraph(deploymentScenario);
      attackGraph = GraphService.formatAttackGraph(graph, deploymentScenario);
      attackGraph = GraphService.generateCoordinates(attackGraph);
    }
    return {
      attackers: deploymentScenario.attackers,
      assets: deploymentScenario.assets,
      attackGraph: attackGraph,
      cves: deploymentScenario.cves,
    };
  }

  async saveAttackGraph(data: DeploymentScenario): Promise<boolean> {
    const deploymentScenario = await this.getById(data.id);
    deploymentScenario.attackGraph = data.attackGraph;
    const result = await this.repo.updateById(deploymentScenario.id, {
      attackGraph: data.attackGraph,
    });
    return result !== null;
  }

  async getAssetCveOnAttackGraph(id: string): Promise<CveOnAttackGraphDto[]> {
    const deploymentScenario = await this.getById(id);
    const assetOnAttackGraph = deploymentScenario.attackGraph.nodes.filter(
      (node) => node.isAsset
    );
    const cvesOnAttackGraph = deploymentScenario.attackGraph.nodes.filter(
      (node) => !node.isAsset && !node.isAttacker && node.phase.includes(3)
    );
    const result = assetOnAttackGraph.map((asset) => {
      const item: CveOnAttackGraphDto = {
        assetId: asset.assetId,
        assetName: asset.label,
        cves: cvesOnAttackGraph
          .filter((cve) => cve.assetId === asset.assetId)
          .map((cve) => cve.cveId),
      };
      return item;
    });
    return result;
  }

  override async getById(id: string): Promise<DeploymentScenario> {
    const entity = await this.repo.getDeploymentScenarioDetail(id);
    this.afterGetById(entity);
    return entity;
  }

  async createDeploymentScenario(data: DeploymentScenario): Promise<string> {
    const context = this.contextService.getContext();
    this.processHistoryInfor(data, context);

    data.exploitability = ExploitabilityCVSS.High;
    data.remediationLevel = RemediationLevelCVSS.Unavailable;
    data.reportConfidence = ReportConfidenceCVSS.Confirmed;

    const countermeasureIds = [];
    const countermeasures = data.countermeasures;
    countermeasures.forEach((countermeasure) => {
      const newId = new mongoose.Types.ObjectId().toString();
      countermeasureIds.push(newId);
      countermeasure._id = newId;
    });

    data.countermeasures = countermeasureIds;

    if (await this.checkExistDeploymentScenarioName(data)) {
      throw new CustomRpcException({
        message: 'Deployment scenario name already exists',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    const deploymentScenarioId = await this.repo.insertOne(data);
    data.id = deploymentScenarioId;

    countermeasures.forEach((countermeasure) => {
      countermeasure.deploymentScenario = deploymentScenarioId;
    });

    await this.countermeasureRepo.insertMany(countermeasures);
    this.deploymentScenarioPublisher.publishDeploymentScenarioCreated(data);
    return deploymentScenarioId;
  }

  async updateSystemProfile(data: SystemProfileDto): Promise<void> {
    await this.repo.updateMany(
      { systemProfileId: new mongoose.Types.ObjectId(data.id) },
      { systemProfileName: data.name }
    );
  }

  async deleteBySystemProfile(id: string): Promise<void> {
    await this.repo.deleteMany({
      systemProfileId: new mongoose.Types.ObjectId(id),
    });
  }

  protected override async afterUpdate(
    data: DeploymentScenario
  ): Promise<void> {
    this.deploymentScenarioPublisher.publishDeploymentScenarioUpdated(data);
  }

  protected override async afterDelete(
    data: DeploymentScenario
  ): Promise<void> {
    const deleteCondition = {
      deploymentScenario: data.id,
    };
    await this.countermeasureRepo.deleteMany(deleteCondition);
    await this.attackerRepo.deleteMany(deleteCondition);
    await this.assetCveRepository.deleteMany(deleteCondition);
    this.deploymentScenarioPublisher.publishDeploymentScenarioDeleted(data);
  }

  async updateAssetCpe(data: UpdateAssetCpeDto): Promise<void> {
    const deploymentScenario = await this.getById(data.deploymentScenarioId);
    await this.validateEntityExist(data.deploymentScenarioId);
    this.validateCreatedBy(deploymentScenario);

    await this.repo.updateAssetCpe(data);
  }

  async getAssetActiveCve(id: string): Promise<GetAssetActiveCveDto> {
    const deploymentScenario = await this.getById(id);
    const assetCves = await this.assetCveRepository.findByCondition({
      deploymentScenario: new mongoose.Types.ObjectId(id),
    });
    const activeCve = {};
    assetCves.forEach((assetCve) => {
      const assetId = assetCve.assetId;
      activeCve[assetId] = assetCve.active;
    });
    const result: GetAssetActiveCveDto = {
      assets: deploymentScenario.assets,
      active: activeCve,
    };
    return result;
  }

  async getDeploymentScenarioDashboard(
    userId: string
  ): Promise<DeploymentScenario[]> {
    return await this.repo.getDeploymentScenarioDashboard({
      createdBy: userId,
    });
  }

  protected async customValidateUpdate(
    data: DeploymentScenario,
    validatedEntity: DeploymentScenario
  ): Promise<void> {
    if (await this.checkExistDeploymentScenarioName(data)) {
      throw new CustomRpcException({
        message: 'Deployment scenario name already exists',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    if (this.checkSwitchStageUpdate(data, validatedEntity)) {
      throw new CustomRpcException({
        message: 'Cannot switch to stage',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
  }

  protected async checkExistDeploymentScenarioName(
    data: DeploymentScenario
  ): Promise<boolean> {
    const filter = {
      name: {
        $regex: `^${data.name}$`,
        $options: 'i',
      },
      createdBy: data.createdBy,
      systemProfileId: new mongoose.Types.ObjectId(data.systemProfileId),
    };
    const result = await this.repo.findByCondition(filter);
    return result.length > 0;
  }

  protected checkSwitchStageUpdate(
    data: DeploymentScenario,
    validatedEntity: DeploymentScenario
  ): boolean {
    return (
      (validatedEntity.status ===
        DeploymentScenarioStatus.RequirementsAnalysis &&
        data.status === DeploymentScenarioStatus.Operations) ||
      (validatedEntity.status === DeploymentScenarioStatus.Operations &&
        data.status === DeploymentScenarioStatus.Deployments)
    );
  }
}
