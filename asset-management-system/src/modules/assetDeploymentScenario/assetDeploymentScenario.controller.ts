import { Controller, Logger, Get, Param } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AssetDeploymentScenarioService } from './assetDeploymentScenario.service';

@Controller('asset-deployment')
export class AssetDeploymentScenarioController {
  constructor(
    private readonly assetDeploymentScenarioService: AssetDeploymentScenarioService,
  ) {}
  @Get('get-deployment-scenario-by-asset-id/:id')
  async getDeploymentScenarioByAssetId(id: string) {
    return await this.assetDeploymentScenarioService.getDeploymentScenarioByAssetId(
      id,
    );
  }

  @EventPattern('deployment-scenario-created')
  async handleDeploymentScenarioCreated(param: any) {
    const data = param.data;
    const newAssetRecord =
      await this.assetDeploymentScenarioService.createAssetDeploymentScenario(
        data,
      );
    // Logger.log(`Created asset record with data: ${JSON.stringify(data)}`);
  }

  @EventPattern('assign-cve-on-asset')
  async handleAssignCveOnAsset(param: any) {
    const data = param.data;
    const assignCveOnAsset =
      await this.assetDeploymentScenarioService.assignCveOnAsset(data);
  }
}
