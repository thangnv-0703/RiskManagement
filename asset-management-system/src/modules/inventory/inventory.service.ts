import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory } from '../../models/schemas/inventory.schema';
import { AssetToInventory } from '../../models/schemas/assetToInventory.schema';
import { Asset } from '../../models/schemas/asset.schema';
import { AssetService } from '../asset/asset.service';
import { DepartmentService } from '../department/department.service';
import { StatusService } from '../status/status.service';
import { InventoryDto } from './dtos/inventory.dto';
import { UpdateAssetToInventoryDto } from './dtos/update-asset-to-inventory.dto';

@Injectable()
export class InventoryService {
  private logger = new Logger(InventoryService.name);

  constructor(
    @InjectModel(Inventory.name)
    private inventoryModel: Model<Inventory>,
    @InjectModel(AssetToInventory.name)
    private assetToInventoryModel: Model<AssetToInventory>,
    private assetService: AssetService,
    private departmentService: DepartmentService,
    private statusService: StatusService,
  ) {}

  async getAllInventories(): Promise<any> {
    const inventories = await this.inventoryModel.find();
    const res = await Promise.all(
      inventories.map(async (inventory) => {
        const { _id, department, ...rest } = inventory.toObject();
        const numOfAssets = await this.assetToInventoryModel.countDocuments({
          inventory: { _id: _id },
        });
        const assetToInventories = await this.assetToInventoryModel.find({
          inventory: { _id: _id },
        });
        return {
          _id,
          ...rest,
          department: department.name,
          assets: numOfAssets,
          remaining: assetToInventories.filter(
            (assetToInventory) => assetToInventory.check === false,
          ).length,
        };
      }),
    );
    return res;
  }

  async getInventoryById(id: string) {
    const inventory = await this.inventoryModel.findById(id);
    return inventory.toObject();
  }

  async createInventory(inventoryDto: InventoryDto) {
    const department = await this.departmentService.getDepartmentById(
      inventoryDto.departmentId,
    );

    const inventory = new this.inventoryModel();
    inventory.name = inventoryDto.name;
    inventory.department = department;
    inventory.start_date = inventoryDto.start_date;
    inventory.end_date = inventoryDto.end_date;
    inventory.note = inventoryDto.note;
    await inventory.save();

    const assets = await this.assetService.getAssetsByDepartmentId(
      inventoryDto.departmentId,
    );
    // console.log(assets);
    await Promise.all(
      assets.map(async (asset: Asset) => {
        const assetToInventory = new this.assetToInventoryModel();
        assetToInventory.inventory = inventory;
        assetToInventory.asset = asset;
        assetToInventory.old_cost = asset.current_cost;
        assetToInventory.new_cost = asset.current_cost;
        assetToInventory.old_status = asset.status;
        assetToInventory.new_status = asset.status;
        // console.log(assetToInventory);
        await assetToInventory.save();
      }),
    );
    return inventory;
  }

  async updateInventory(id: string, inventoryDto: InventoryDto) {
    const toUpdate = await this.inventoryModel.findById(id);
    toUpdate.name = inventoryDto?.name;
    toUpdate.start_date = inventoryDto?.start_date;
    toUpdate.note = inventoryDto?.note;
    toUpdate.end_date = inventoryDto?.end_date;
    return await toUpdate.save();
  }

  async getAssetToInventoryByInventoryId(id: string): Promise<any> {
    const assetToInventories: AssetToInventory[] =
      await this.assetToInventoryModel
        .find({
          inventory: { _id: id },
        })
        .populate('asset')
        .populate('old_status')
        .populate('new_status');
    const res = assetToInventories.map((assetToInventory) => {
      const { asset, old_status, new_status, ...rest } =
        assetToInventory.toObject();
      return {
        ...rest,
        asset_id: asset._id,
        asset_name: asset.name,
        purchase_date: asset.purchase_date,
        purchase_cost: asset.purchase_cost,
        old_status: old_status.name,
        new_status: new_status.name,
      };
    });
    return res;
  }

  async updateAssetToInventory(
    id: string,
    updateDto: UpdateAssetToInventoryDto,
  ) {
    if (
      String(updateDto?.new_cost) === '' ||
      isNaN(Number(updateDto?.new_cost)) ||
      updateDto?.new_cost < 0
    )
      throw new HttpException(
        `New cost of asset ${updateDto?.assetId} is invalid`,
        HttpStatus.BAD_REQUEST,
      );
    const toUpdate = await this.assetToInventoryModel.findById(id);
    const status = await this.statusService.getStatusById(
      updateDto.newStatusId,
    );
    toUpdate.new_cost = updateDto?.new_cost;
    toUpdate.check = updateDto?.check;
    toUpdate.new_status = status;
    await toUpdate.save();
    await this.assetService.saveAssetAfterInventory(
      updateDto.assetId,
      updateDto.newStatusId,
      updateDto.new_cost,
    );
    return toUpdate;
  }
}
