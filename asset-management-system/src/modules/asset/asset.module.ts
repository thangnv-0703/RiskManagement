import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetSchema } from '../../models/schemas/asset.schema';
import { AssetToUserSchema } from '../../models/schemas/assetToUser.schema';
import { RequestAssetSchema } from '../../models/schemas/requestAsset..schema';

import { AdminModule } from '../admin/admin.module';
import { AssetModelModule } from '../assetModel/assetModel.module';
import { CategoryModule } from '../category/category.module';
import { DepartmentModule } from '../department/department.module';
import { DeprecationModule } from '../deprecation/deprecation.module';
import { ManufacturerModule } from '../manufacturer/manufacturer.module';
import { NotificationModule } from '../notification/notification.module';
import { StatusModule } from '../status/status.module';
import { SupplierModule } from '../supplier/supplier.module';
import { UsersModule } from '../users/users.module';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Asset', schema: AssetSchema },
      { name: 'AssetToUser', schema: AssetToUserSchema },
      { name: 'RequestAsset', schema: RequestAssetSchema },
    ]),
    UsersModule,
    AdminModule,
    AssetModelModule,
    DepartmentModule,
    StatusModule,
    SupplierModule,
    CategoryModule,
    DeprecationModule,
    forwardRef(() => NotificationModule),
  ],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
