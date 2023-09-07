import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './configs/mongo.config.service';
import { AssessmentResultModule } from './assessment-result/assessment-result.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    AssessmentResultModule,
  ],
})
export class RootModule {}
