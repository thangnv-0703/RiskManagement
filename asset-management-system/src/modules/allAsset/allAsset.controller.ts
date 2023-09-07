import { Controller, Get, Param } from '@nestjs/common';
import { AllAssetService } from './allAsset.service';

@Controller('all-asset')
export class AllAssetController {
  constructor(private readonly appService: AllAssetService) {}

  @Get('')
  async getAllAsset() {
    const result = await this.appService.getAllAsset();
    return result || [];
  }
}
