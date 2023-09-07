import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './configs/mongo.config.service';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    CategoryModule,
  ],
})
export class RootModule {}
