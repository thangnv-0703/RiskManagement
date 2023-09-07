import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../../models/schemas/notification.schema';
import { AssetService } from '../asset/asset.service';
import { LicenseService } from '../license/license.service';
import { NotificationDto } from './dtos/notification.dto';
import { NotificationType } from './notification.constants';

@Injectable()
export class NotificationService {
  private logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    @Inject(forwardRef(() => AssetService))
    private assetService: AssetService,
    @Inject(forwardRef(() => LicenseService))
    private licenseService: LicenseService,
  ) {}

  async getAllNotifications(): Promise<any> {
    // const notifications = await this.notificationModel.find({
    //   order: { expiration_date: 'ASC' },
    // });
    const notifications = await this.notificationModel
      .find()
      .sort({ expiration_date: 1 });
    const res = Promise.all(
      notifications.map(async (notification) => {
        const rest = notification.toObject();
        const asset = await this.assetService.getAssetById(notification.itemId);
        const license = await this.licenseService.getLicenseById(
          notification.itemId,
        );
        return {
          ...rest,
          name:
            notification.type === NotificationType.ASSET
              ? asset?.name
              : license?.name,
        };
      }),
    );
    return res;
  }

  async createNewNotification(notificationDto: NotificationDto) {
    const notification = new this.notificationModel();
    notification.itemId = notificationDto.itemId;
    notification.expiration_date = notificationDto.expiration_date;
    notification.type = notificationDto.type;
    await notification.save();
    return notification;
  }

  async deleteNotification(type: NotificationType, id: string) {
    let res;
    if (type === NotificationType.ASSET)
      res = await this.notificationModel.deleteOne({ type, itemId: id });
    else if (type == NotificationType.LICENSE)
      res = await this.notificationModel.deleteOne({ type, itemId: id });
    return res;
  }
}
