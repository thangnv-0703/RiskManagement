import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetSchema } from '../../models/schemas/asset.schema';
import { AssetModelSchema } from '../../models/schemas/assetModel.schema';
import { AssetModelController } from './assetModel.controller';
import { AssetModelService } from './assetModel.service';
import { CategoryModule } from '../category/category.module';
import { ManufacturerModule } from '../manufacturer/manufacturer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AssetModel', schema: AssetModelSchema },
      { name: 'Asset', schema: AssetSchema },
    ]),
    CategoryModule,
    ManufacturerModule,
  ],
  controllers: [AssetModelController],
  providers: [AssetModelService],
  exports: [AssetModelService],
})
export class AssetModelModule {}
