import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OS } from '../../models/schemas/os.schema';
import { OSDto } from './dtos/os.dto';

@Injectable()
export class OSService {
  private logger = new Logger(OSService.name);

  constructor(
    @InjectModel(OS.name)
    private readonly osModel: Model<OS>,
  ) {}

  async getAllOSes(): Promise<any> {
    const oses = await this.osModel.find();
    const res = Promise.all(oses.map((os) => os.toObject()));
    return res;
  }

  async getOSById(id: string) {
    const os = await this.osModel.findById(id);
    return os.toObject();
  }

  async createNewOS(osDto: OSDto) {
    if (await this.osModel.findOne({ name: osDto.name }))
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    return await this.osModel.create(osDto);
  }

  async updateOS(id: string, osDto: OSDto) {
    if (
      (await this.osModel.findById(id))?.name !== osDto.name &&
      (await this.osModel.findOne({ name: osDto.name }))
    )
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    const toUpdate = await this.osModel.findById(id);

    toUpdate.name = osDto.name;
    toUpdate.description = osDto.description;
    toUpdate.version = osDto.version;
    return await toUpdate.save();
  }

  async deleteOS(id: string): Promise<any> {
    try {
      return await this.osModel.findByIdAndDelete(id);
    } catch (err) {
      throw new HttpException(
        'This value is still in use',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
