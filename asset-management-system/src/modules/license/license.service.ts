import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as dayjs from 'dayjs';
import { Cron } from '@nestjs/schedule';
import { License } from '../../models/schemas/license.schema';
import { LicenseToAsset } from '../../models/schemas/licenseToAsset.schema';

import { CategoryService } from '../category/category.service';
import { ManufacturerService } from '../manufacturer/manufacturer.service';
import { SupplierService } from '../supplier/supplier.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/notification.constants';
import { AssetService } from '../asset/asset.service';

import { LicenseDto } from './dtos/license.dto';
import { LicenseQueryDto } from './dtos/licenseQuery.dto';
import { CheckoutLicenseDto } from './dtos/checkoutLicense.dto';
import { CheckinLicenseDto } from './dtos/checkinLicense.dto';
import { LicenseToAssetQueryDto } from './dtos/licenseToAsset.dto';

@Injectable()
export class LicenseService {
  private logger = new Logger(LicenseService.name);

  constructor(
    @InjectModel(License.name)
    private licenseModel: Model<License>,
    @InjectModel(LicenseToAsset.name)
    private licenseToAssetModel: Model<LicenseToAsset>,
    private assetService: AssetService,
    private categoryService: CategoryService,
    private manufacturerService: ManufacturerService,
    private supplierService: SupplierService,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
  ) {}

  async getAll(licenseQuery?: LicenseQueryDto): Promise<any> {
    const licenses = await this.licenseModel
      .find({
        deletedAt: null,
        ...(licenseQuery.categoryId && {
          category: { _id: licenseQuery.categoryId },
        }),
        ...(licenseQuery.manufacturerId && {
          manufacturer: { _id: licenseQuery.manufacturerId },
        }),
        ...(licenseQuery.supplierId && {
          supplier: { _id: licenseQuery.supplierId },
        }),
      })
      .populate('category')
      .populate('manufacturer')
      .populate('supplier')
      .populate('licenseToAssets');
    const res = await Promise.all(
      licenses.map(async (license) => {
        const { _id, category, manufacturer, supplier, ...rest } =
          license.toObject();
        const licenseToAssets = await this.licenseToAssetModel.countDocuments({
          license: { _id: _id },
          deletedAt: null,
        });
        return {
          _id,
          ...rest,
          category: license?.category?.name,
          manufacturer: license?.manufacturer?.name,
          supplier: license?.supplier?.name,
          available: license.seats - licenseToAssets,
        };
      }),
    );
    return res;
  }

  async getLicenseByLicenseId(id: string): Promise<any> {
    const license = await this.licenseModel
      .findOne({
        _id: id,
        deletedAt: null,
      })
      .populate('category')
      .populate('supplier')
      .populate('manufacturer')
      .populate('licenseToAssets');
    const { _id, category, manufacturer, supplier, ...rest } =
      license.toObject();
    const licenseToAssets = await this.licenseToAssetModel.countDocuments({
      license: { _id: _id },
      deletedAt: null,
    });
    return {
      _id,
      ...rest,
      category: license?.category?.name,
      manufacturer: license?.manufacturer?.name,
      supplier: license?.supplier?.name,
      available: license.seats - licenseToAssets,
    };
  }

  async getLicenseToAsset(
    licenseToAssetQueryDto?: LicenseToAssetQueryDto,
  ): Promise<any> {
    const licenseToAssets = await this.licenseToAssetModel
      .find({
        ...(licenseToAssetQueryDto.assetId && {
          asset: { _id: licenseToAssetQueryDto.assetId },
        }),
        ...(licenseToAssetQueryDto.licenseId && {
          license: { _id: licenseToAssetQueryDto.licenseId },
        }),
      })
      .populate('asset')
      .populate('license');
    const res = licenseToAssets.map((licenseToAsset) => {
      const { asset, license, ...rest } = licenseToAsset.toObject();
      return {
        ...rest,
        assetId: asset?._id,
        assetName: asset?.name,
        licenseId: license?._id,
        licenseName: license?.name,
      };
    });
    return res;
  }

  async createNewLicense(licenseDto: LicenseDto) {
    const category = await this.categoryService.getCategoryById(
      licenseDto.categoryId,
    );
    const manufacturer = await this.manufacturerService.getManufacturerById(
      licenseDto.manufacturerId,
    );
    const supplier = await this.supplierService.getSupplierById(
      licenseDto.supplierId,
    );

    const license = new this.licenseModel();
    license.name = licenseDto.name;
    license.key = licenseDto.key;
    license.purchase_cost = licenseDto.purchaseCost;
    license.purchase_date = licenseDto.purchaseDate;
    license.expiration_date = licenseDto.expirationDate;
    license.seats = licenseDto.seats;
    license.category = category;
    license.manufacturer = manufacturer;
    license.supplier = supplier;

    await license.save();
    await this.handleCronLicenseExpiration();
    return license;
  }

  async updateLicense(id: string, licenseDto: LicenseDto) {
    const toUpdate = await this.licenseModel.findOne({
      _id: id,
      deletedAt: null,
    });
    const { categoryId, manufacturerId, supplierId, ...rest } = licenseDto;
    const category = await this.categoryService.getCategoryById(
      licenseDto.categoryId,
    );
    const manufacturer = await this.manufacturerService.getManufacturerById(
      licenseDto.manufacturerId,
    );
    const supplier = await this.supplierService.getSupplierById(
      licenseDto.supplierId,
    );
    // const updated = Object.assign(toUpdate, rest);
    toUpdate.name = licenseDto.name;
    toUpdate.key = licenseDto.key;
    toUpdate.purchase_cost = licenseDto.purchaseCost;
    toUpdate.purchase_date = licenseDto.purchaseDate;
    toUpdate.expiration_date = licenseDto.expirationDate;
    toUpdate.seats = licenseDto.seats;
    toUpdate.category = category;
    toUpdate.manufacturer = manufacturer;
    toUpdate.supplier = supplier;
    await toUpdate.save();
    await this.handleCronLicenseExpiration();
    return toUpdate;
  }

  async deleteLicense(id: string) {
    await this.notificationService.deleteNotification(
      NotificationType.LICENSE,
      id,
    );
    const toRemove = await this.licenseModel
      .findOne({
        _id: id,
        deletedAt: null,
      })
      .populate('licenseToAssets');
    if (toRemove) {
      toRemove.deletedAt = new Date(Date.now());
      await toRemove.save();
    }
    return toRemove;
  }

  async getLicenseById(id: string) {
    const license: License = await this.licenseModel.findById({
      _id: id,
      deletedAt: null,
    });
    return license;
  }

  /*------------------------ checkin/checkout license ------------------------- */

  async checkoutLicense(checkoutLicenseDto: CheckoutLicenseDto) {
    const license = await this.licenseModel
      .findOne({
        _id: checkoutLicenseDto.licenseId,
        deletedAt: null,
      })
      .populate('licenseToAssets');
    const licenseToAssets = await this.licenseToAssetModel.countDocuments({
      license: { _id: license._id },
      deletedAt: null,
    });
    if (licenseToAssets >= license.seats)
      throw new HttpException('This license is full', HttpStatus.BAD_REQUEST);
    if (
      await this.licenseToAssetModel.findOne({
        asset: { _id: checkoutLicenseDto.assetId },
        license: { _id: checkoutLicenseDto.licenseId },
      })
    )
      throw new HttpException(
        'This asset is already checkout',
        HttpStatus.BAD_REQUEST,
      );
    const asset = await this.assetService.getAssetById(
      checkoutLicenseDto.assetId,
    );
    const licenseToAsset = new this.licenseToAssetModel();
    licenseToAsset.asset = asset;
    licenseToAsset.license = license;
    licenseToAsset.checkout_date = checkoutLicenseDto.checkout_date;
    licenseToAsset.checkout_note = checkoutLicenseDto.checkout_note;
    await licenseToAsset.save();
    return licenseToAsset;
  }

  async checkinLicense(checkinLicenseDto: CheckinLicenseDto) {
    const licenseToAsset = await this.licenseToAssetModel.findOne({
      _id: checkinLicenseDto.licenseToAssetId,
      deletedAt: null,
    });
    licenseToAsset.checkin_date = checkinLicenseDto.checkin_date;
    licenseToAsset.checkin_note = checkinLicenseDto.checkin_note;
    licenseToAsset.deletedAt = new Date(Date.now());
    await licenseToAsset.save();
    return licenseToAsset;
  }

  /*------------------------ cron ------------------------- */

  // At 00:00 everyday
  @Cron('0 0 * * *')
  async handleCronLicenseExpiration() {
    const licenses: License[] = await this.licenseModel.find({
      deletedAt: null,
    });
    await Promise.all(
      licenses.map(async (license: License) => {
        const expiration_date = license.expiration_date;
        const date1 = dayjs(expiration_date);
        const date2 = dayjs(); // current date and time
        const diff = date1.diff(date2, 'day'); // calculate the difference in days
        await this.notificationService.deleteNotification(
          NotificationType.LICENSE,
          license._id,
        );
        if (diff <= 30) {
          await this.notificationService.createNewNotification({
            itemId: license._id,
            expiration_date: license.expiration_date,
            type: NotificationType.LICENSE,
          });
        }
      }),
    );
  }
}
