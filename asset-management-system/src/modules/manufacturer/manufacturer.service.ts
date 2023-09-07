import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Manufacturer } from '../../models/schemas/manufacturer.schema';
import { AssetModel } from '../../models/schemas/assetModel.schema';
import { License } from '../../models/schemas/license.schema';
import { FirebaseService } from '../firebase/firebase.service';
import { ManufacturerDto } from './dtos/manufacturer.dto';
import { IMAGE_PATH } from './manufacturer.constants';

@Injectable()
export class ManufacturerService {
  private logger = new Logger(ManufacturerService.name);

  constructor(
    @InjectModel(Manufacturer.name)
    private readonly manufacturerModel: Model<Manufacturer>,
    @InjectModel(AssetModel.name)
    private readonly assetModelModel: Model<AssetModel>,
    @InjectModel(License.name)
    private readonly licenseModel: Model<License>,
    private firebaseService: FirebaseService,
  ) {}

  async getAllManufacturers(): Promise<any> {
    const manufacturers = await this.manufacturerModel
      .find()
      .populate('assetModels')
      .populate('licenses');
    const res = await Promise.all(
      manufacturers.map(async (manufacturer) => {
        const { _id, ...rest } = manufacturer.toObject();
        const assetModels = await this.assetModelModel.countDocuments({
          manufacturer: { _id: _id },
        });
        const licenses = await this.licenseModel.countDocuments({
          manufacturer: { _id: _id },
          deletedAt: null,
        });
        return {
          _id,
          ...rest,
          assetModels,
          licenses,
        };
      }),
    );
    return res;
  }

  async getManufacturerById(id: string) {
    const manufacturer = await this.manufacturerModel.findById(id);
    return manufacturer.toObject();
  }

  async createNewManufacturer(manufacturerDto: ManufacturerDto) {
    if (await this.manufacturerModel.findOne({ name: manufacturerDto.name }))
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    const manufacturer = new this.manufacturerModel();
    manufacturer.name = manufacturerDto.name;
    await manufacturer.save();
    return manufacturer;
  }

  async saveImage(id: string, file: Express.Multer.File) {
    // upload ảnh lên storage
    const image = await this.firebaseService.uploadFile(file, IMAGE_PATH);
    // cập nhật db
    return await this.manufacturerModel.findByIdAndUpdate(id, { image });
  }

  async updateManufacturer(id: string, manufacturerDto: ManufacturerDto) {
    if (
      (await this.manufacturerModel.findById(id))?.name !==
        manufacturerDto.name &&
      (await this.manufacturerModel.findOne({ name: manufacturerDto.name }))
    )
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    const updated = await this.manufacturerModel.findByIdAndUpdate(
      id,
      manufacturerDto,
    );
    return updated;
  }

  async deleteManufacturer(id: string) {
    try {
      return await this.manufacturerModel.findByIdAndDelete(id);
    } catch (err) {
      throw new HttpException(
        'This value is still in use',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
