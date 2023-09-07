import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import AssetToInventory from 'src/models/entities/assetToInventory.entity';
// import Inventory from 'src/models/entities/inventory.entity';
// import { AssetToInventoryRepository } from 'src/models/repositories/assetToInventory.repository';
// import { InventoryRepository } from 'src/models/repositories/inventory.repository';
import { InventorySchema } from '../../models/schemas/inventory.schema';
import { AssetToInventorySchema } from '../../models/schemas/assetToInventory.schema';
import { AssetModule } from '../asset/asset.module';
import { DepartmentModule } from '../department/department.module';
import { StatusModule } from '../status/status.module';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Inventory', schema: InventorySchema },
      { name: 'AssetToInventory', schema: AssetToInventorySchema },
    ]),
    DepartmentModule,
    AssetModule,
    StatusModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
