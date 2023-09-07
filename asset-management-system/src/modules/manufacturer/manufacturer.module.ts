import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManufacturerSchema } from '../../models/schemas/manufacturer.schema';
import { AssetModelSchema } from '../../models/schemas/assetModel.schema';
import { LicenseSchema } from '../../models/schemas/license.schema';
import { ManufacturerController } from './manufacturer.controller';
import { ManufacturerService } from './manufacturer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Manufacturer', schema: ManufacturerSchema },
      { name: 'AssetModel', schema: AssetModelSchema },
      { name: 'License', schema: LicenseSchema },
    ]),
  ],
  controllers: [ManufacturerController],
  providers: [ManufacturerService],
  exports: [ManufacturerService],
})
export class ManufacturerModule {}
