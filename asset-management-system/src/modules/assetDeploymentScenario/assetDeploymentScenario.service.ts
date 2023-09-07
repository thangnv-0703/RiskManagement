// asset.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { DeploymentScenario } from '../../../../backend-service/apps/system-profile/src/system-profile/core/domain/deployment-scenario';
import { AssetDeploymentScenario } from '../../models/schemas/assetDeploymentScenario.schema';
import { Asset } from '../../models/schemas/asset.schema';
import { Application } from '../../models/schemas/application.schema';
import { OS } from '../../models/schemas/os.schema';

@Injectable()
export class AssetDeploymentScenarioService {
  private readonly logger = new Logger(AssetDeploymentScenarioService.name);
  constructor(
    @InjectModel(AssetDeploymentScenario.name)
    private readonly assetDeploymentScenarioModel: Model<AssetDeploymentScenario>,
    @InjectModel(Asset.name)
    private readonly assetModel: Model<Asset>,
    @InjectModel(Application.name)
    private readonly applicationModel: Model<Application>,
    @InjectModel(OS.name)
    private readonly osModel: Model<OS>,
  ) {}
  async createAssetDeploymentScenario(data: any): Promise<any> {
    this.logger.log(data);
    const assetDeploymentScenario = {
      id: data.id,
      name: data.name,
      assetIds: data.assets.map((asset) => asset.id),
    };
    const splitObjects = assetDeploymentScenario.assetIds.map((assetId) => ({
      assetId: assetId,
      deploymentScenarioId: assetDeploymentScenario.id,
      deploymentScenarioName: assetDeploymentScenario.name,
    }));

    // this.logger.log(splitObjects);

    const res = await Promise.all(
      splitObjects.map(async (obj) => {
        // console.log(obj.assetId);
        const updatedAsset = await this.assetModel.findOneAndUpdate(
          { _id: obj.assetId },
          {
            $push: {
              deploymentScenarios: {
                id: obj.deploymentScenarioId,
                name: obj.deploymentScenarioName,
              },
            },
          },
          { new: true },
        );

        const updatedApplication = await this.applicationModel.findOneAndUpdate(
          { _id: obj.assetId },
          {
            $push: {
              deploymentScenarios: {
                id: obj.deploymentScenarioId,
                name: obj.deploymentScenarioName,
              },
            },
          },
          { new: true },
        );
        console.log(updatedApplication);

        const updatedOS = await this.osModel.findOneAndUpdate(
          { _id: obj.assetId },
          {
            $push: {
              deploymentScenarios: {
                id: obj.deploymentScenarioId,
                name: obj.deploymentScenarioName,
              },
            },
          },
          { new: true },
        );
        console.log(updatedOS);
        // const newObj = await this.assetDeploymentScenarioModel.create(obj);
        // return newObj;
      }),
    );
    return res;
  }
  async assignCveOnAsset(data: any) {
    console.log(data);
    const updatedCveOnHardware = await this.assetModel.findOneAndUpdate(
      { _id: data.assetId },
      { cves: data.cves },
      { new: true },
    );
    // console.log(updatedCveOnHardware);

    const updatedCveOnApplication =
      await this.applicationModel.findOneAndUpdate(
        { _id: data.assetId },
        { cves: data.cves },
        { new: true },
      );
    // console.log(updatedCveOnApplication);

    const updatedCveOnOS = await this.osModel.findOneAndUpdate(
      { _id: data.assetId },
      { cves: data.cves },
      { new: true },
    );
    // console.log(updatedCveOnOS);
  }
  // async createAssetDeploymentScenario(data: any) {
  //   this.logger.log('Billing...', data);
  // }
  async getDeploymentScenarioByAssetId(id: string) {
    const assetDeploymentScenarios =
      await this.assetDeploymentScenarioModel.find({ assetId: id });
    return assetDeploymentScenarios;
  }
}
