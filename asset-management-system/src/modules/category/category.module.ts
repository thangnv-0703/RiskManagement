import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from '../../models/schemas/category.schema';
import { AssetModelSchema } from '../../models/schemas/assetModel.schema';
import { LicenseSchema } from '../../models/schemas/license.schema';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
      { name: 'AssetModel', schema: AssetModelSchema },
      { name: 'License', schema: LicenseSchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
