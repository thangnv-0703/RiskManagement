import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Supplier } from '../../models/schemas/supplier.schema';
import { Asset } from '../../models/schemas/asset.schema';
import { License } from '../../models/schemas/license.schema';
import { SupplierDto } from './dtos/supplier.dto';

@Injectable()
export class SupplierService {
  private logger = new Logger(SupplierService.name);

  constructor(
    @InjectModel(Supplier.name)
    private readonly supplierModel: Model<Supplier>,
    @InjectModel(Asset.name)
    private readonly assetModel: Model<Asset>,
    @InjectModel(License.name)
    private readonly licenseModel: Model<License>,
  ) {}

  async getAllSuppliers(): Promise<any> {
    const suppliers = await this.supplierModel
      .find()
      .populate('assets')
      .populate('licenses');
    const res = await Promise.all(
      suppliers.map(async (supplier) => {
        const { _id, ...rest } = supplier.toObject();
        const assets = await this.assetModel.countDocuments({
          deletedAt: null,
          supplier: { _id: _id },
        });
        const licenses = await this.licenseModel.countDocuments({
          deletedAt: null,
          supplier: { _id: _id },
        });
        return {
          _id,
          ...rest,
          assets,
          licenses,
        };
      }),
    );
    return res;
  }

  async getSupplierById(id: string): Promise<Supplier> {
    const supplier = await this.supplierModel.findById(id);
    return supplier.toObject();
  }

  async createNewSupplier(supplierDto: SupplierDto): Promise<Supplier> {
    if (await this.supplierModel.findOne({ name: supplierDto.name }))
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    return await this.supplierModel.create(supplierDto);
  }

  async updateSupplier(
    id: string,
    supplierDto: SupplierDto,
  ): Promise<Supplier> {
    if (
      (await this.supplierModel.findById(id))?.name !== supplierDto.name &&
      (await this.supplierModel.findOne({ name: supplierDto.name }))
    )
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    const toUpdate = await this.supplierModel.findById(id);
    toUpdate.name = supplierDto.name;
    return await toUpdate.save();
  }

  async deleteSupplier(id: string): Promise<Supplier> {
    try {
      return await this.supplierModel.findByIdAndDelete(id);
    } catch (err) {
      throw new HttpException(
        'This value is still in use',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
