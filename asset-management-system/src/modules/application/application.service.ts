import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application } from '../../models/schemas/application.schema';
import { ApplicationDto } from './dtos/application.dto';

@Injectable()
export class ApplicationService {
  private logger = new Logger(ApplicationService.name);

  constructor(
    @InjectModel(Application.name)
    private readonly applicationModel: Model<Application>,
  ) {}

  async getAllApplications(): Promise<any> {
    const applications = await this.applicationModel.find();
    const res = await Promise.all(
      applications.map((application) => application.toObject()),
    );
    return res;
  }

  async getApplicationById(id: string) {
    const application = await this.applicationModel.findById(id);
    return application.toObject();
  }

  async createNewApplication(applicationDto: ApplicationDto) {
    if (await this.applicationModel.findOne({ name: applicationDto.name }))
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    return await this.applicationModel.create(applicationDto);
  }

  async updateApplication(id: string, applicationDto: ApplicationDto) {
    if (
      (await this.applicationModel.findById(id))?.name !==
        applicationDto.name &&
      (await this.applicationModel.findOne({ name: applicationDto.name }))
    )
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    const toUpdate = await this.applicationModel.findById(id);

    toUpdate.name = applicationDto.name;
    toUpdate.description = applicationDto.description;
    toUpdate.version = applicationDto.version;
    return await toUpdate.save();
  }

  async deleteApplication(id: string): Promise<any> {
    try {
      return await this.applicationModel.findByIdAndDelete(id);
    } catch (err) {
      throw new HttpException(
        'This value is still in use',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
