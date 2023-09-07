import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Put,
  Body,
  ParseIntPipe,
  Delete,
  Query,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { CheckinLicenseDto } from './dtos/checkinLicense.dto';
import { CheckoutLicenseDto } from './dtos/checkoutLicense.dto';
import { LicenseDto } from './dtos/license.dto';
import { LicenseQueryDto } from './dtos/licenseQuery.dto';
import { LicenseToAssetQueryDto } from './dtos/licenseToAsset.dto';
import { LicenseService } from './license.service';

@ApiTags('license')
@Controller('license')
export class LicenseController {
  constructor(private licenseService: LicenseService) {}

  @Get('')
  // @UseGuards(JwtAdminAuthGuard)
  async getAllLicenses(@Query() licenseQuery: LicenseQueryDto) {
    return await this.licenseService.getAll(licenseQuery);
  }

  @Get(':id')
  // @UseGuards(JwtAdminAuthGuard)
  async getLicenseById(@Param('id') id: string) {
    return await this.licenseService.getLicenseByLicenseId(id);
  }

  @Get('license-to-asset')
  // @UseGuards(JwtAdminAuthGuard)
  async getLicenseToAsset(@Query() licenseToAssetDto: LicenseToAssetQueryDto) {
    return await this.licenseService.getLicenseToAsset(licenseToAssetDto);
  }

  @Post('')
  // @UseGuards(JwtAdminAuthGuard)
  async createLicense(@Body() licenseDto: LicenseDto) {
    return await this.licenseService.createNewLicense(licenseDto);
  }

  @Put('')
  // @UseGuards(JwtAdminAuthGuard)
  async updateLicense(@Body() licenseDto: LicenseDto, @Body('id') id: string) {
    return await this.licenseService.updateLicense(id, licenseDto);
  }

  @Delete('')
  // @UseGuards(JwtAdminAuthGuard)
  async deleteLicense(@Body('id') id: string) {
    return await this.licenseService.deleteLicense(id);
  }

  @Post('checkout-license')
  // @UseGuards(JwtAdminAuthGuard)
  async checkoutLicense(@Body() checkoutLicenseDto: CheckoutLicenseDto) {
    return await this.licenseService.checkoutLicense(checkoutLicenseDto);
  }

  @Post('checkin-license')
  // @UseGuards(JwtAdminAuthGuard)
  async checkinLicense(@Body() checkinLicenseDto: CheckinLicenseDto) {
    return await this.licenseService.checkinLicense(checkinLicenseDto);
  }
}
