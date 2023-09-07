import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './configs/mongo.config.service';
import { DeploymentScenarioModule } from './deployment-scenario/deployment-scenario.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    DeploymentScenarioModule,
  ],
})
export class RootModule {}
