import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssetMaintenance } from '../../models/schemas/assetMaintenance.schema';
import { AssetService } from '../asset/asset.service';
import { SupplierService } from '../supplier/supplier.service';
import { AssetMaintenanceDto } from './dtos/assetMaintenance.dto';
import { AssetMaintenanceQueryDto } from './dtos/assetMaintenanceQuery.dto';

@Injectable()
export class AssetMaintenanceService {
  private logger = new Logger(AssetMaintenanceService.name);

  constructor(
    @InjectModel(AssetMaintenance.name)
    private assetMaintenanceModel: Model<AssetMaintenance>,
    private assetService: AssetService,
    private supplierService: SupplierService,
  ) {}

  async getAllAssetMaintenances(
    assetMaintenanceQueryDto?: AssetMaintenanceQueryDto,
  ): Promise<any> {
    const assetMaintenances = await this.assetMaintenanceModel
      .find({
        'asset._id': assetMaintenanceQueryDto.assetId,
      })
      .populate('asset')
      .populate('supplier');
    const res = assetMaintenances.map((assetMaintenance) => {
      const { asset, supplier, ...rest } = assetMaintenance.toObject();
      return {
        ...rest,
        asset_id: asset?._id,
        asset_name: asset?.name,
        supplier: supplier?.name,
      };
    });
    return res;
  }

  async getAssetMaintenanceById(id: string) {
    const assetMaintenance = await this.assetMaintenanceModel.findById(id);
    return assetMaintenance;
  }

  async createNewAssetMaintenance(assetMaintenanceDto: AssetMaintenanceDto) {
    const supplier = await this.supplierService.getSupplierById(
      assetMaintenanceDto.supplierId,
    );
    const asset = await this.assetService.getAssetById(
      assetMaintenanceDto.assetId,
    );
    const assetMaintenance = new this.assetMaintenanceModel();
    assetMaintenance.start_date = assetMaintenanceDto.start_date;
    assetMaintenance.end_date = assetMaintenanceDto.end_date;
    assetMaintenance.cost = assetMaintenanceDto.cost;
    assetMaintenance.note = assetMaintenanceDto.note;
    assetMaintenance.asset = asset;
    assetMaintenance.supplier = supplier;

    await assetMaintenance.save();
    return assetMaintenance;
  }

  async updateAssetMaintenance(
    id: string,
    assetMaintenanceDto: AssetMaintenanceDto,
  ) {
    const toUpdate = await this.assetMaintenanceModel.findById(id);
    const { assetId, supplierId, ...rest } = assetMaintenanceDto;
    const asset = await this.assetService.getAssetById(
      assetMaintenanceDto.assetId,
    );
    const supplier = await this.supplierService.getSupplierById(
      assetMaintenanceDto.supplierId,
    );
    const updated = Object.assign(toUpdate, rest);
    updated.asset = asset;
    updated.supplier = supplier;
    return await updated.save();
  }

  async deleteAssetMaintenance(id: string) {
    return await this.assetMaintenanceModel.findByIdAndDelete(id);
  }
}
