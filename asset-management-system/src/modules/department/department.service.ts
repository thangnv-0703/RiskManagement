import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LocationService } from '../location/location.service';
import { DepartmentDto } from './dtos/department.dto';
import { DepartmentQueryDto } from './dtos/departmentQuery.dto';
import { Department } from '../../models/schemas/department.schema';
import { Asset } from '../../models/schemas/asset.schema';
import { User } from '../../models/schemas/user.schema';

@Injectable()
export class DepartmentService {
  private logger = new Logger(DepartmentService.name);

  constructor(
    @InjectModel(Department.name)
    private readonly departmentModel: Model<Department>,
    @InjectModel(Asset.name)
    private readonly assetModel: Model<Asset>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private locationService: LocationService,
  ) {}

  async getAllDepartments(departmentQuery?: DepartmentQueryDto): Promise<any> {
    const departments = await this.departmentModel
      .find({
        ...(departmentQuery.locationId && {
          location: { _id: departmentQuery.locationId },
        }),
      })
      .populate('assets')
      .populate('users')
      .populate('location');
    const res = await Promise.all(
      departments.map(async (department) => {
        const { _id, location, ...rest } = department.toObject();
        const assets = await this.assetModel.countDocuments({
          department: { _id: _id },
          deletedAt: null,
        });
        const users = await this.userModel.countDocuments({
          department: { _id: _id },
          deletedAt: null,
        });
        return {
          _id,
          ...rest,
          assets,
          users,
          location: location?.name ?? '',
        };
      }),
    );
    return res;
  }

  async countDepartments(id: string) {
    const numOfDepartments = await this.departmentModel.countDocuments({
      location: { _id: id },
    });
    return numOfDepartments;
  }

  async getDepartmentByDepartmentId(id: string): Promise<any> {
    const department = await this.departmentModel
      .findById(id)
      .populate('location');
    const { location, ...rest } = department.toObject();

    return {
      ...rest,
      location: location?.name ?? '',
    };
  }

  async getDepartmentById(id: string) {
    const department = await this.departmentModel.findById(id);
    return department.toObject();
  }

  async getDepartmentByLocationId(id: string) {
    const department = await this.departmentModel.findOne({
      location: { _id: id },
    });
    return department;
  }

  async createNewDepartment(departmentDto: DepartmentDto) {
    if (await this.departmentModel.findOne({ name: departmentDto.name }))
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    const department = new this.departmentModel();
    department.name = departmentDto.name;

    const location = await this.locationService.getLocationById(
      departmentDto.locationId,
    );
    department.location = location;

    return await department.save();
  }

  async updateDepartment(id: string, departmentDto: DepartmentDto) {
    if (
      (await this.departmentModel.findById(id))?.name !== departmentDto.name &&
      (await this.departmentModel.findOne({ name: departmentDto.name }))
    )
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    const toUpdate = await this.departmentModel.findById(id);
    const location = await this.locationService.getLocationById(
      departmentDto.locationId,
    );
    toUpdate.name = departmentDto.name;
    toUpdate.location = location;
    return await toUpdate.save();
  }

  async deleteDepartment(id: string) {
    try {
      return await this.departmentModel.findByIdAndDelete(id);
    } catch (err) {
      throw new HttpException(
        'This value is still in use',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
