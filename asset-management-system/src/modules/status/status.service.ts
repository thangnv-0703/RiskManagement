import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Status } from '../../models/schemas/status.schema';
import { Asset } from '../../models/schemas/asset.schema';
import { StatusDto } from './dtos/status.dto';

@Injectable()
export class StatusService {
  private logger = new Logger(StatusService.name);

  constructor(
    @InjectModel(Status.name)
    private readonly statusModel: Model<Status>,
    @InjectModel(Asset.name)
    private readonly assetModel: Model<Asset>,
  ) {}

  async getAllStatuses(): Promise<any> {
    const statuses = await this.statusModel.find().populate('assets');
    const res = await Promise.all(
      statuses.map(async (status) => {
        const { _id, ...rest } = status.toObject();
        const numOfAssets = await this.assetModel.countDocuments({
          deletedAt: null,
          status: { _id: _id },
        });
        return {
          _id,
          ...rest,
          numOfAssets,
        };
      }),
    );
    return res;
  }

  async getStatusById(id: string) {
    const status = await this.statusModel.findById(id);
    return status.toObject();
  }

  async createNewStatus(statusDto: StatusDto) {
    if (await this.statusModel.findOne({ name: statusDto.name }))
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    return await this.statusModel.create(statusDto);
  }

  async updateStatus(id: string, statusDto: StatusDto) {
    if (
      (await this.statusModel.findById(id))?.name !== statusDto.name &&
      (await this.statusModel.findOne({ name: statusDto.name }))
    )
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    const toUpdate = await this.statusModel.findById(id);

    toUpdate.name = statusDto.name;
    toUpdate.color = statusDto.color;
    await toUpdate.save();
    return toUpdate;
  }

  async deleteStatus(id: string) {
    try {
      return await this.statusModel.findByIdAndDelete(id);
    } catch (err) {
      throw new HttpException(
        'This value is still in use',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
