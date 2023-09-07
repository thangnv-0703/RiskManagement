import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LicenseSchema } from '../../models/schemas/license.schema';
import { LicenseToAssetSchema } from '../../models/schemas/licenseToAsset.schema';
import { AssetModule } from '../asset/asset.module';
import { CategoryModule } from '../category/category.module';
import { ManufacturerModule } from '../manufacturer/manufacturer.module';
import { NotificationModule } from '../notification/notification.module';
import { SupplierModule } from '../supplier/supplier.module';
import { LicenseController } from './license.controller';
import { LicenseService } from './license.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'License', schema: LicenseSchema },
      { name: 'LicenseToAsset', schema: LicenseToAssetSchema },
    ]),
    forwardRef(() => AssetModule),
    CategoryModule,
    ManufacturerModule,
    SupplierModule,
    forwardRef(() => NotificationModule),
  ],
  controllers: [LicenseController],
  providers: [LicenseService],
  exports: [LicenseService],
})
export class LicenseModule {}
