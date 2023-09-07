import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deprecation } from '../../models/schemas/deprecation.schema';
import { CategoryService } from '../category/category.service';
import { DeprecationDto } from './dtos/deprecation.dto';

@Injectable()
export class DeprecationService {
  private logger = new Logger(DeprecationService.name);

  constructor(
    @InjectModel(Deprecation.name)
    private deprecationModel: Model<Deprecation>,
    private categoryService: CategoryService,
  ) {}

  async getAllDeprecations(): Promise<any> {
    const deprecations = await this.deprecationModel
      .find()
      .populate('category');
    const res = deprecations.map((deprecation) => {
      const { category, ...rest } = deprecation.toObject();
      return {
        ...rest,
        category: category.name,
      };
    });
    return res;
  }

  async getDeprecationById(id: string) {
    const deprecation = await this.deprecationModel.findById(id);
    return deprecation;
  }

  async createNewDeprecation(deprecationDto: DeprecationDto) {
    if (
      await this.deprecationModel.findOne({
        // 'category._id': deprecationDto.categoryId,
        category: { _id: deprecationDto.categoryId },
      })
    )
      throw new HttpException(
        'This category has been set',
        HttpStatus.BAD_REQUEST,
      );
    const deprecation = new this.deprecationModel();
    deprecation.name = deprecationDto.name;
    deprecation.months = deprecationDto.months;
    const category = await this.categoryService.getCategoryById(
      deprecationDto.categoryId,
    );
    deprecation.category = category;
    await deprecation.save();
    return deprecation;
  }

  async updateDeprecation(id: string, deprecationDto: DeprecationDto) {
    try {
      const toUpdate = await this.deprecationModel.findById(id);
      if (!toUpdate) {
        throw new Error('Deprecation document not found');
      }

      // const updated = Object.assign(toUpdate, deprecationDto);
      const category = await this.categoryService.getCategoryById(
        deprecationDto.categoryId,
      );
      toUpdate.name = deprecationDto.name;
      toUpdate.months = deprecationDto.months;
      toUpdate.category = category;
      return await toUpdate.save();
    } catch (err) {
      throw new HttpException(
        'This category has been set',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteDeprecation(id: string) {
    return await this.deprecationModel.findByIdAndDelete(id);
  }

  /*------------------------ cron ------------------------- */
  async getAllDeprecationsForCron() {
    const deprecations = await this.deprecationModel
      .find()
      .populate('category');
    return deprecations;
  }
}
