import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';

import { Asset } from '../../models/schemas/asset.schema';
import { AssetModel } from '../../models/schemas/assetModel.schema';
import { AssetToUser } from '../../models/schemas/assetToUser.schema';
import { Category } from '../../models/schemas/category.schema';
import { Deprecation } from '../../models/schemas/deprecation.schema';
import { RequestAsset } from '../../models/schemas/requestAsset..schema';

import { AdminService } from '../admin/admin.service';
import { AssetModelService } from '../assetModel/assetModel.service';
import { CategoryService } from '../category/category.service';
import { DepartmentService } from '../department/department.service';
import { DeprecationService } from '../deprecation/deprecation.service';
import { FirebaseService } from '../firebase/firebase.service';
import { MailService } from '../mail/mail.service';
import { NotificationType } from '../notification/notification.constants';
import { NotificationService } from '../notification/notification.service';
import { StatusService } from '../status/status.service';
import { SupplierService } from '../supplier/supplier.service';
import { UsersService } from '../users/users.service';
import { CheckType, IMAGE_PATH, RequestAssetStatus } from './asset.constants';
import { AssetDto } from './dtos/asset.dto';
import { AssetHistoryQueryDto } from './dtos/assetHistoryQuery.dto';
import { AssetQueryDto } from './dtos/assetQuery.dto';
import { CheckinAssetDto } from './dtos/checkinAsset.dto';
import { CheckoutAssetDto } from './dtos/checkoutAsset.dto';
import { NewRequestAsset } from './dtos/new-request-asset.dto';
@Injectable()
export class AssetService {
  private logger = new Logger(AssetService.name);

  constructor(
    // private dataSource: DataSource,
    @InjectModel(Asset.name)
    private assetModel: Model<Asset>,
    @InjectModel(AssetToUser.name)
    private assetToUserModel: Model<AssetToUser>,
    @InjectModel(RequestAsset.name)
    private requestAssetModel: Model<RequestAsset>,
    private userService: UsersService,
    private adminService: AdminService,
    private assetModelService: AssetModelService,
    private departmentService: DepartmentService,
    private statusService: StatusService,
    private supplierService: SupplierService,
    private categoryService: CategoryService,
    private deprecationService: DeprecationService,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
    private mailService: MailService,
    private firebaseService: FirebaseService,
  ) {}

  async getAll(assetQuery?: AssetQueryDto): Promise<any> {
    const assets = await this.assetModel
      .find({
        deletedAt: null,
        ...(assetQuery.assetModelId && {
          assetModel: { _id: assetQuery.assetModelId },
        }),
        ...(assetQuery.departmentId && {
          department: { _id: assetQuery.departmentId },
        }),
        ...(assetQuery.statusId && { status: { _id: assetQuery.statusId } }),
        // ...(assetQuery.userId && { user: { _id: assetQuery.userId } }),
      })
      .populate('assetModel')
      .populate('department')
      .populate('status')
      .populate('supplier')
      .populate('assetToUsers');
    return (
      await Promise.all(
        assets.map(async (asset) => {
          const {
            assetModel,
            department,
            status,
            supplier,
            assetToUsers,
            ...rest
          } = asset.toObject();
          const assetToUser = await this.assetToUserModel
            .findOne({
              asset: { _id: asset._id },
              deletedAt: null,
            })
            .populate('user');
          const user = assetToUser
            ? await this.userService.getUserById(assetToUser?.user?._id)
            : null;
          const res = {
            ...rest,
            assetModel: asset?.assetModel?.name,
            department: asset?.department?.name,
            status: asset?.status?.name,
            statusColor: asset?.status?.color,
            supplier: asset?.supplier?.name,
            username: assetToUser ? user?.name : null,
            user: user,
            check_type: assetToUser ? CheckType.CHECKIN : CheckType.CHECKOUT,
          };
          if (assetQuery.userId) {
            if (user?._id.toString() === assetQuery?.userId) return res;
            else return;
          } else return res;
        }),
      )
    ).filter((item) => Boolean(item));
  }

  async getDeletedAssets(): Promise<any> {
    const assets = await this.assetModel
      .find({
        deletedAt: { $ne: null },
      })
      .populate('assetModel')
      .populate('department')
      .populate('status')
      .populate('supplier')
      .populate('assetToUsers');
    return (
      await Promise.all(
        assets.map(async (asset) => {
          const {
            assetModel,
            department,
            status,
            supplier,
            assetToUsers,
            ...rest
          } = asset.toObject();
          const assetToUser = await this.assetToUserModel
            .findOne({
              asset: { _id: asset._id },
            })
            .populate('user');
          const user = assetToUser
            ? await this.userService.getUserById(assetToUser?.user?._id)
            : null;
          const res = {
            ...rest,
            assetModel: asset?.assetModel?.name,
            department: asset?.department?.name,
            status: asset?.status?.name,
            statusColor: asset?.status?.color,
            supplier: asset?.supplier?.name,
            username: assetToUser ? user?.name : null,
            user: user,
            check_type: assetToUser ? CheckType.CHECKIN : CheckType.CHECKOUT,
          };
          return res;
        }),
      )
    ).filter((item) => Boolean(item));
  }

  async getAssetHistory(
    assetHistoryQueryDto?: AssetHistoryQueryDto,
  ): Promise<any> {
    // const assetToUsers: AssetToUser[] = await this.assetToUserRepo.find({
    //   relations: {
    //     asset: true,
    //     user: true,
    //   },
    //   where: {
    //     asset: { id: assetHistoryQueryDto.assetId },
    //     user: { id: assetHistoryQueryDto.userId },
    //   },
    //   withDeleted: true,
    // });
    const assetToUsers: AssetToUser[] = await this.assetToUserModel
      .find({
        ...(assetHistoryQueryDto.assetId && {
          asset: { _id: assetHistoryQueryDto.assetId },
        }),
        ...(assetHistoryQueryDto.userId && {
          user: { _id: assetHistoryQueryDto.userId },
        }),
      })
      .populate('asset')
      .populate('user');
    return Promise.all(
      assetToUsers.map((assetToUser: AssetToUser) => {
        const { asset, user, ...rest } = assetToUser.toObject();
        return {
          ...rest,
          assetId: asset?._id,
          assetName: asset?.name,
          userId: user?._id,
          userName: user?.name,
        };
      }),
    );
  }

  async getAssetByAssetId(id: string): Promise<any> {
    const asset: Asset = await this.assetModel
      // .findById(id)
      .findOne({ _id: id, deletedAt: null })
      .populate('assetModel')
      .populate('department')
      .populate('status')
      .populate('supplier')
      .populate('assetToUsers');
    const { assetModel, assetToUsers, department, status, supplier, ...rest } =
      asset.toObject();
    const assetToUser = await this.assetToUserModel
      .findOne({
        // 'asset._id': asset._id,
        asset: { _id: asset._id },
      })
      .populate('user');
    const user = assetToUser
      ? await this.userService.getUserById(assetToUser?.user?._id)
      : null;
    return {
      ...rest,
      assetModel: asset?.assetModel?.name,
      department: asset?.department?.name,
      status: asset?.status?.name,
      statusColor: asset?.status?.color,
      supplier: asset?.supplier?.name,
      username: assetToUser ? user?.name : null,
      user: user,
      check_type: assetToUser ? CheckType.CHECKIN : CheckType.CHECKOUT,
    };
  }

  async createNewAsset(assetDto: AssetDto) {
    const assetModel = await this.assetModelService.getAssetModelById(
      assetDto.assetModelId,
    );
    const department = await this.departmentService.getDepartmentById(
      assetDto.departmentId,
    );
    const status = await this.statusService.getStatusById(assetDto.statusId);
    const supplier = await this.supplierService.getSupplierById(
      assetDto.supplierId,
    );

    const asset = new this.assetModel();
    asset.name = assetDto.name;
    asset.purchase_date = dayjs(assetDto.purchaseDate).toDate();
    asset.purchase_cost = assetDto.purchaseCost;
    asset.assetModel = assetModel;
    asset.department = department;
    asset.status = status;
    asset.supplier = supplier;

    await asset.save();
    await this.handleCronAssetDeprecation();
    return asset;
  }

  async saveImage(id: string, file: Express.Multer.File) {
    // upload ảnh lên storage
    const image = await this.firebaseService.uploadFile(file, IMAGE_PATH);
    // cập nhật db
    return await this.assetModel.findByIdAndUpdate(id, { image });
  }

  async importAsset(assetDtos: AssetDto[]) {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    try {
      await Promise.all(
        assetDtos.map(async (assetDto: AssetDto) => {
          const assetModel = await this.assetModelService.getAssetModelById(
            assetDto.assetModelId,
          );
          const department = await this.departmentService.getDepartmentById(
            assetDto.departmentId,
          );
          const status = await this.statusService.getStatusById(
            assetDto.statusId,
          );
          const supplier = await this.supplierService.getSupplierById(
            assetDto.supplierId,
          );
          const asset = new this.assetModel();
          asset.name = assetDto.name;
          asset.purchase_date = dayjs(assetDto.purchaseDate).toDate();
          asset.purchase_cost = assetDto.purchaseCost;
          asset.assetModel = assetModel;
          asset.department = department;
          asset.status = status;
          asset.supplier = supplier;
          await asset.save();
        }),
      );
      // await session.commitTransaction();
      await this.handleCronAssetDeprecation();
      return assetDtos;
    } catch (err) {
      // await session.abortTransaction();
      throw err;
    }
    // finally {
    //   session.endSession();
    // }
  }

  async updateAsset(id: string, assetDto: AssetDto) {
    const toUpdate = await this.assetModel.findOne({
      _id: id,
      deletedAt: null,
    });
    const { assetModelId, departmentId, statusId, supplierId, ...rest } =
      assetDto;
    const assetModel = await this.assetModelService.getAssetModelById(
      assetDto.assetModelId,
    );
    const department = await this.departmentService.getDepartmentById(
      assetDto.departmentId,
    );
    const status = await this.statusService.getStatusById(assetDto.statusId);
    const supplier = await this.supplierService.getSupplierById(
      assetDto.supplierId,
    );
    // const updated = Object.assign(toUpdate, rest);
    toUpdate.name = assetDto.name;
    toUpdate.purchase_cost = assetDto.purchaseCost;
    toUpdate.purchase_date = assetDto.purchaseDate;
    toUpdate.assetModel = assetModel;
    toUpdate.department = department;
    toUpdate.status = status;
    toUpdate.supplier = supplier;
    await toUpdate.save();
    await this.handleCronAssetDeprecation();
    return toUpdate;
  }

  async deleteAsset(id: string) {
    try {
      await this.notificationService.deleteNotification(
        NotificationType.ASSET,
        id,
      );
      const toRemove = await this.assetModel
        .findById(id)
        .populate('assetToUsers')
        .populate('assetMaintenances')
        .populate('licenseToAssets');
      if (toRemove) {
        toRemove.deletedAt = new Date(Date.now());
        await toRemove.save();
      }
      return toRemove;
    } catch (err) {
      throw new HttpException('Cannot delete', HttpStatus.BAD_REQUEST);
    }
  }

  /*------------------------ checkin/checkout asset ------------------------- */

  async checkoutAsset(checkoutAssetDto: CheckoutAssetDto) {
    // const asset = await this.assetModel.findById(checkoutAssetDto.assetId);
    const asset = await this.assetModel.findOne({
      _id: checkoutAssetDto.assetId,
      deletedAt: null,
    });
    const user = await this.userService.getUserById(checkoutAssetDto.userId);

    const department = await this.departmentService.getDepartmentById(
      user?.department._id,
    );
    const status = await this.statusService.getStatusById(
      checkoutAssetDto.statusId,
    );
    asset.status = status;
    asset.department = department;
    const assetToUser = new this.assetToUserModel();
    assetToUser.asset = asset;
    assetToUser.user = user;
    assetToUser.checkout_date = checkoutAssetDto.checkout_date;
    assetToUser.checkout_note = checkoutAssetDto.checkout_note;
    await asset.save();
    await assetToUser.save();
    await this.mailService.sendUserCheckoutAsset(user, asset);
    return assetToUser;
  }

  async checkinAsset(checkinAssetDto: CheckinAssetDto) {
    // const asset = await this.assetModel.findById(checkinAssetDto.assetId);
    const asset = await this.assetModel.findOne({
      _id: checkinAssetDto.assetId,
      deletedAt: null,
    });
    const department = await this.departmentService.getDepartmentById(
      checkinAssetDto.departmentId,
    );
    const status = await this.statusService.getStatusById(
      checkinAssetDto.statusId,
    );
    const assetToUser = await this.assetToUserModel.findOne({
      asset: { _id: checkinAssetDto.assetId },
      deletedAt: null,
    });
    asset.department = department;
    asset.status = status;
    assetToUser.checkin_date = checkinAssetDto.checkin_date;
    assetToUser.checkin_note = checkinAssetDto.checkin_note;
    // Implement soft delete
    assetToUser.deletedAt = new Date(Date.now());
    await asset.save();
    await assetToUser.save();
    return assetToUser;
  }

  async getAssetById(id: string) {
    const asset: Asset = await this.assetModel.findOne({
      _id: id,
      deletedAt: null,
    });
    return asset;
  }

  /*------------------------ asset to inventory ------------------------- */

  async getAssetsByDepartmentId(id: string) {
    const assets = await this.assetModel
      .find({
        deletedAt: null,
        department: { _id: id },
      })
      .populate('status');
    return assets;
  }

  async saveAssetAfterInventory(id: string, statusId: string, newCost: number) {
    // const asset = await this.assetModel.findById(id);
    const asset = await this.assetModel.findOne({ _id: id, deletedAt: null });
    const status = await this.statusService.getStatusById(statusId);
    asset.status = status;
    asset.current_cost = newCost;
    await asset.save();
  }

  /*------------------------ request asset ------------------------- */

  async getAssetsByCategory(categoryId: string) {
    const assetModels =
      await this.assetModelService.getAllAssetModelsByCategory(categoryId);
    const assets2D: Asset[][] = await Promise.all(
      assetModels.map(async (assetModel: AssetModel) => {
        return await this.assetModel
          .find({
            assetModel: { _id: assetModel._id },
          })
          .populate('assetToUsers');
      }),
    );
    const assets: Asset[] = [].concat(...assets2D);
    return assets
      .filter((asset: Asset) => asset.assetToUsers.length === 0)
      .sort((a, b) => a.id - b.id);
  }

  async getAllRequestAssets(): Promise<any> {
    const requestAsset = await this.requestAssetModel
      .find()
      .populate('category')
      .populate('user');
    const res = requestAsset.map((r: RequestAsset) => {
      const { category, user, ...rest } = r.toObject();
      return {
        ...rest,
        category: category.name,
        categoryId: category._id,
        name: user.name,
        username: user.username,
      };
    });
    return res;
  }

  async acceptRequest(id: string, assetId: string) {
    const request = await this.requestAssetModel.findById(id).populate('user');
    if (request.status !== RequestAssetStatus.REQUESTED)
      throw new HttpException(
        'This request was accepted/rejected',
        HttpStatus.BAD_REQUEST,
      );
    if (await this.assetToUserModel.findOne({ asset: { _id: assetId } }))
      throw new HttpException('This asset is in use', HttpStatus.BAD_REQUEST);
    request.status = RequestAssetStatus.ACCEPTED;
    request.assetId = assetId;
    await request.save();
    const assetToUser = new this.assetToUserModel();
    const user = await this.userService.getUserById(request.user._id);
    const asset = await this.getAssetById(assetId);
    assetToUser.user = user;
    assetToUser.asset = asset;
    assetToUser.checkout_date = dayjs().toDate();
    await assetToUser.save();
    await this.mailService.sendUserAcceptRequest(user, asset);
    return request;
  }

  async rejectRequest(id: string) {
    const request = await this.requestAssetModel.findById(id).populate('user');
    const user = await this.userService.getUserById(request.user._id);
    if (request.status !== RequestAssetStatus.REQUESTED)
      throw new HttpException(
        'This request was accepted/rejected',
        HttpStatus.BAD_REQUEST,
      );
    request.status = RequestAssetStatus.REJECTED;
    await request.save();
    await this.mailService.sendUserRejectRequest(user);
    return request;
  }

  /*------------------------ cron ------------------------- */

  // At 00:00 every Sunday
  @Cron('0 0 * * 0')
  async handleCronAssetDeprecation() {
    const deprecations: Deprecation[] =
      await this.deprecationService.getAllDeprecationsForCron();
    await Promise.all(
      deprecations.map(async (deprecation: Deprecation) => {
        const category: Category = deprecation.category;
        const assetModels: AssetModel[] =
          await this.assetModelService.getAllAssetModelsByCategory(category.id);
        await Promise.all(
          assetModels.map(async (assetModel: AssetModel) => {
            const assets: Asset[] = assetModel.assets;
            await Promise.all(
              assets.map(async (asset: Asset) => {
                const months = deprecation.months;
                const purchase_date = asset.purchase_date;
                const date1 = dayjs(purchase_date);
                const date2 = dayjs();
                const diffMonth = date2.diff(date1, 'month');
                asset.current_cost = Math.max(
                  Math.round(
                    (asset.purchase_cost / months) * (months - diffMonth),
                  ),
                  0,
                );
                await asset.save();

                const expiration_date = date1.add(months, 'month').toDate();
                const diffDay = dayjs(expiration_date).diff(date2, 'day');
                await this.notificationService.deleteNotification(
                  NotificationType.ASSET,
                  asset._id,
                );
                if (diffDay <= 30) {
                  await this.notificationService.createNewNotification({
                    itemId: asset._id,
                    expiration_date: expiration_date,
                    type: NotificationType.ASSET,
                  });
                }
              }),
            );
          }),
        );
      }),
    );
  }

  /*------------------------ user ------------------------- */

  async getAssetToUser(userId: string): Promise<any> {
    const assetToUsers = await this.assetToUserModel
      .find({
        // 'user._id': userId,
        user: { _id: userId },
      })
      .populate('asset')
      .populate('user');
    const res = await Promise.all(
      assetToUsers.map(async (assetToUser) => {
        const assetId = assetToUser.asset._id;
        const asset = await this.assetModel
          .findById(assetId)
          .populate('assetModel')
          .populate('department')
          .populate('status')
          .populate('supplier');
        return {
          ...assetToUser.asset.toObject(),
          assetModel: asset?.assetModel?.name,
          department: asset?.department?.name,
          status: asset?.status?.name,
          statusColor: asset?.status?.color,
          supplier: asset?.supplier?.name,
        };
      }),
    );
    return res;
  }

  async getAssetRequestedByUser(id: string): Promise<any> {
    const requestAsset = await this.requestAssetModel
      .find({
        // 'user._id': id,
        user: { _id: id },
      })
      .populate('category');
    const res = requestAsset.map((r: RequestAsset) => {
      const { category, ...rest } = r.toObject();
      return { ...rest, category: category.name };
    });
    return res;
  }

  async createNewRequestAsset(userId: string, newRequest: NewRequestAsset) {
    const newRequestAsset = new this.requestAssetModel();

    const user = await this.userService.getUserById(userId);
    const admins = await this.adminService.getAllAdmins();
    const category = await this.categoryService.getCategoryById(
      newRequest.categoryId,
    );
    if (!category)
      throw new HttpException('Category not exist', HttpStatus.BAD_REQUEST);
    newRequestAsset.user = user;
    newRequestAsset.category = category;
    newRequestAsset.note = newRequest.note;
    await newRequestAsset.save();
    await Promise.all(
      admins.map(async (admin) => {
        await this.mailService.sendAdminRequestAsset(user, admin);
      }),
    );
    return newRequestAsset;
  }
}
