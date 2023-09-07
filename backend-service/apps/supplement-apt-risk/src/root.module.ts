import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './configs/mongo.config.service';
import { AptConfigModule } from './apt-config/apt-config.module';
import { AssessmentSettingModule } from './apt-assessment-setting/factor-assessment.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    AptConfigModule,
    AssessmentSettingModule,
  ],
})
export class RootModule {}
