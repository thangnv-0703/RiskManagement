import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetDeploymentScenarioSchema } from '../../models/schemas/assetDeploymentScenario.schema';
import { AssetSchema } from 'src/models/schemas/asset.schema';
import { ApplicationSchema } from 'src/models/schemas/application.schema';
import { OSSchema } from 'src/models/schemas/os.schema';
import { AssetDeploymentScenarioController } from './assetDeploymentScenario.controller';
import { AssetDeploymentScenarioService } from './assetDeploymentScenario.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'AssetDeploymentScenario',
        schema: AssetDeploymentScenarioSchema,
      },
      {
        name: 'Asset',
        schema: AssetSchema,
      },
      {
        name: 'Application',
        schema: ApplicationSchema,
      },
      {
        name: 'OS',
        schema: OSSchema,
      },
    ]),
  ],
  controllers: [AssetDeploymentScenarioController],
  providers: [AssetDeploymentScenarioService],
  exports: [AssetDeploymentScenarioService],
})
export class AssetDeploymentScenarioModule {}
