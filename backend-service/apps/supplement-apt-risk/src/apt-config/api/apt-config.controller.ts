import { Serialize } from '@libs/common/interceptors';
import { ApiController } from '@libs/common/decorator';
import { HttpAuthGuard } from '@libs/common/guard';
import { Body, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { AptConfigDto, SaveAptConfigDto } from './dtos';
import { AptConfigDIToken } from './di-token';
import { AptConfigServicePort } from '../core/application/apt-config.service.port';
import { AptConfig } from '../core/domain/apt-config';

@UseGuards(HttpAuthGuard)
@ApiController('supplement_apt_risk', 'Factor Assessment')
export class AptConfigController {
  constructor(
    @Inject(AptConfigDIToken.AptConfigService)
    readonly service: AptConfigServicePort
  ) {}

  @Get('config')
  @Serialize(AptConfigDto)
  getConfig() {
    return this.service.getConfig();
  }

  /* Updating the entity with the id. */
  @Post('config')
  update(@Body() data: SaveAptConfigDto) {
    return this.service.saveConfig(data as unknown as AptConfig);
  }
}
