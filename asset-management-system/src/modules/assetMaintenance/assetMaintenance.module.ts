import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetMaintenanceSchema } from '../../models/schemas/assetMaintenance.schema';
import { AssetModule } from '../asset/asset.module';
import { SupplierModule } from '../supplier/supplier.module';
import { AssetMaintenanceController } from './assetMaintenance.controller';
import { AssetMaintenanceService } from './assetMaintenance.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AssetMaintenance', schema: AssetMaintenanceSchema },
    ]),
    AssetModule,
    SupplierModule,
  ],
  controllers: [AssetMaintenanceController],
  providers: [AssetMaintenanceService],
  exports: [AssetMaintenanceService],
})
export class AssetMaintenanceModule {}
