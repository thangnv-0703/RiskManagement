import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Admin } from '../../models/schemas/admin.schema';
import { Asset } from '../../models/schemas/asset.schema';
import { User } from '../../models/schemas/user.schema';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserAcceptRequest(user: User, asset: Asset) {
    const url = `${this.configService.get('FRONTEND')}`;

    await this.mailerService.sendMail({
      to: user?.email,
      subject: 'Request accept',
      template: './accept',
      context: {
        name: user.name,
        asset_id: asset._id,
        asset_name: asset.name,
        url,
      },
    });
  }

  async sendUserRejectRequest(user: User) {
    const url = `${this.configService.get('FRONTEND')}/request-asset`;

    await this.mailerService.sendMail({
      to: user?.email,
      subject: 'Request reject',
      template: './reject',
      context: {
        name: user.name,
        url,
      },
    });
  }

  async sendUserCheckoutAsset(user: User, asset: Asset) {
    const url = `${this.configService.get('FRONTEND')}`;

    await this.mailerService.sendMail({
      to: user?.email,
      subject: 'Checkout asset',
      template: './checkout',
      context: {
        name: user.name,
        asset_id: asset._id,
        asset_name: asset.name,
        url,
      },
    });
  }

  async sendAdminRequestAsset(user: User, admin: Admin) {
    const url = `${this.configService.get('ADMIN')}/request-assets`;

    await this.mailerService.sendMail({
      to: admin?.email,
      subject: 'Request accept',
      template: './request',
      context: {
        user_name: user.name,
        user_id: user._id,
        url,
      },
    });
  }
}
