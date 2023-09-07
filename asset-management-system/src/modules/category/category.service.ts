import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../../models/schemas/category.schema';
import { AssetModel } from '../../models/schemas/assetModel.schema';
import { License } from '../../models/schemas/license.schema';
import { IMAGE_PATH } from './category.constants';
import { CategoryDto } from './dtos/category.dto';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class CategoryService {
  private logger = new Logger(CategoryService.name);

  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<Category>,
    @InjectModel(AssetModel.name)
    private readonly assetModelModel: Model<AssetModel>,
    @InjectModel(License.name)
    private readonly licenseModel: Model<License>,
    private firebaseService: FirebaseService,
  ) {}

  async getAllCategories(): Promise<any> {
    const categories = await this.categoryModel
      .find()
      .populate('assetModels')
      .populate('licenses');
    const res = await Promise.all(
      categories.map(async (category) => {
        const { _id, ...rest } = category.toObject();
        const assetModels = await this.assetModelModel.countDocuments({
          category: { _id: _id },
        });
        const licenses = await this.licenseModel.countDocuments({
          category: { _id: _id },
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

  async getCategoryById(id: string) {
    const category = await this.categoryModel.findById(id);
    return category.toObject();
  }

  async createNewCategory(categoryDto: CategoryDto) {
    if (await this.categoryModel.findOne({ name: categoryDto.name }))
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    const category = new this.categoryModel();
    category.name = categoryDto.name;
    await category.save();
    return category;
  }

  async saveImage(id: string, file: Express.Multer.File) {
    // upload ảnh lên storage
    const image = await this.firebaseService.uploadFile(file, IMAGE_PATH);
    // cập nhật db
    return await this.categoryModel.findByIdAndUpdate(id, { image: image });
  }

  async updateCategory(id: string, categoryDto: CategoryDto) {
    if (
      (await this.categoryModel.findById(id))?.name !== categoryDto.name &&
      (await this.categoryModel.findOne({ name: categoryDto.name }))
    )
      throw new HttpException(
        'This value already exists',
        HttpStatus.BAD_REQUEST,
      );
    // let toUpdate = await this.categoryRepo.findOneBy({ id });
    // let updated = Object.assign(toUpdate, categoryDto);
    // return await this.categoryRepo.save(updated);
    const updated = await this.categoryModel.findByIdAndUpdate(id, categoryDto);
    return updated;
  }

  async deleteCategory(id: string) {
    try {
      return await this.categoryModel.findByIdAndDelete(id);
    } catch (err) {
      throw new HttpException(
        'This value is still in use',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
