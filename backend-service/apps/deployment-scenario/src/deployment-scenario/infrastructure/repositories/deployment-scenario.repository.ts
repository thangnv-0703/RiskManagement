import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@libs/common/base';
import { Model } from 'mongoose';
import { DeploymentScenarioRepositoryPort } from '../../core/domain/interfaces';
import {
  AppliedCountermeasure,
  DeploymentScenario,
  Attacker,
} from '../../core/domain/documents';
import { UpdateAssetCpeDto } from '../../api/dtos';

export class DeploymentScenarioRepository
  extends BaseRepository<DeploymentScenario>
  implements DeploymentScenarioRepositoryPort
{
  constructor(
    @InjectModel(DeploymentScenario.name)
    readonly collection: Model<DeploymentScenario>
  ) {
    super(collection);
  }

  async getDeploymentScenarioDetail(id: string): Promise<DeploymentScenario> {
    const result = await this.collection
      .findById(id)
      .populate('attackers')
      .populate('countermeasures')
      .populate('cves')
      .exec();
    return result;
  }

  async updateAttacker(attacker: Attacker): Promise<DeploymentScenario> {
    return await this.collection.findByIdAndUpdate(
      attacker.deploymentScenario,
      {
        $addToSet: { attackers: attacker.id },
        $set: { attackGraph: {} },
      }
    );
  }

  // update cve
  async updateCve(
    deploymentScenarioId: string,
    assetCveId: string
  ): Promise<DeploymentScenario> {
    return await this.collection.findByIdAndUpdate(deploymentScenarioId, {
      $addToSet: { cves: assetCveId },
    });
  }

  // update attack graph {}
  async updateEmptyAttackGraph(deploymentScenarioId: string): Promise<boolean> {
    const result = await this.collection.findByIdAndUpdate(
      deploymentScenarioId,
      { $set: { attackGraph: {} } }
    );
    return result !== null;
  }

  async removeAttacker(attackerId: string): Promise<boolean> {
    const result = await this.collection.updateMany(
      { attackers: attackerId },
      { $pull: { attackers: attackerId }, $set: { attackGraph: {} } }
    );
    return result.modifiedCount > 0;
  }

  async updateCountermeasure(
    countermeasure: AppliedCountermeasure
  ): Promise<DeploymentScenario> {
    return await this.collection.findByIdAndUpdate(
      countermeasure.deploymentScenario,
      {
        $addToSet: { countermeasures: countermeasure.id },
      }
    );
  }

  async removeCountermeasure(countermeasureId: string): Promise<boolean> {
    const result = await this.collection.updateMany(
      { countermeasures: countermeasureId },
      {
        $pull: { countermeasures: countermeasureId },
      }
    );
    return result.modifiedCount > 0;
  }

  async updateAssetCpe(data: UpdateAssetCpeDto): Promise<void> {
    if (data.id) {
      const deploymentScenario = await this.collection.findById(
        data.deploymentScenarioId
      );
      const updatedAssets = deploymentScenario.assets.map((asset) => {
        if (asset.id === data.id) {
          asset = data;
        }
        return asset;
      });

      deploymentScenario.assets = updatedAssets;
      await deploymentScenario.save();
    }
  }

  async getDeploymentScenarioDashboard(
    condition: object
  ): Promise<DeploymentScenario[]> {
    const result = await this.collection
      .find(condition)
      .populate('cves', 'active assetId')
      .sort({ createdAt: -1 })
      .exec();
    return result;
  }
}
