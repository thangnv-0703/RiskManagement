import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetSchema } from '../../models/schemas/asset.schema';
import { LicenseSchema } from '../../models/schemas/license.schema';
import { SupplierSchema } from '../../models/schemas/supplier.schema';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Supplier', schema: SupplierSchema },
      { name: 'Asset', schema: AssetSchema },
      { name: 'License', schema: LicenseSchema },
    ]),
  ],
  controllers: [SupplierController],
  providers: [SupplierService],
  exports: [SupplierService],
})
export class SupplierModule {}
