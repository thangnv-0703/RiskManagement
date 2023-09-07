import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location } from '../../models/schemas/location.schema';
import { Department } from '../../models/schemas/department.schema';
import { LocationDto } from './dtos/location';
// import { DepartmentService } from '../department/department.service';

@Injectable()
export class LocationService {
  private logger = new Logger(LocationService.name);

  constructor(
    @InjectModel(Location.name)
    private readonly locationModel: Model<Location>,
    @InjectModel(Department.name)
    private readonly departmentModel: Model<Department>,
  ) {}

  async getAllLocations(): Promise<any> {
    const locations = await this.locationModel.find();
    const res = await Promise.all(
      locations.map(async (location) => {
        const { _id, ...rest } = location.toObject();
        const numOfDepartments = await this.departmentModel.countDocuments({
          location: { _id: _id },
        });
        return {
          ...rest,
          _id,
          numOfDepartments,
        };
      }),
    );
    return res;
  }

  async getLocationById(id: string) {
    const location = await this.locationModel.findById(id);
    return location.toObject();
  }

  async createNewLocation(locationDto: LocationDto) {
    if (await this.locationModel.findOne({ name: locationDto.name }))
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    return await this.locationModel.create(locationDto);
  }

  async updateLocation(id: string, locationDto: LocationDto) {
    if (
      (await this.locationModel.findById(id))?.name !== locationDto.name &&
      (await this.locationModel.findOne({ name: locationDto.name }))
    )
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    const toUpdate = await this.locationModel.findById(id);

    toUpdate.name = locationDto.name;
    toUpdate.address = locationDto.address;
    return await toUpdate.save();
  }

  async deleteLocation(id: string): Promise<any> {
    try {
      return await this.locationModel.findByIdAndDelete(id);
    } catch (err) {
      throw new HttpException(
        'This value is still in use',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
