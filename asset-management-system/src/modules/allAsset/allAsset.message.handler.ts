import { Controller, Get, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AllAssetService } from './allAsset.service';

@Controller('')
export class AllAssetMessageHandler {
  constructor(private readonly appService: AllAssetService) {}

  @MessagePattern('get-all-asset')
  async getAllAsset(param: any) {
    const result = await this.appService.getAllAsset();
    return result || [];
  }
}
