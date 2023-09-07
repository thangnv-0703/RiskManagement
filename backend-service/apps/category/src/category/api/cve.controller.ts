import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CveServicePort } from '../core/application/cve.service.port';
import { CategoryDIToken } from './di-token';
import { CveDto } from './dtos';
import { Serialize } from '@libs/common/interceptors';
import { PagingQueyDto } from '@libs/api-contract';
import { HttpAuthGuard } from '@libs/common/guard';

@Serialize(CveDto)
@Controller('/cves')
export class CveController {
  constructor(
    @Inject(CategoryDIToken.CveService) readonly service: CveServicePort
  ) {}

  @UseGuards(HttpAuthGuard)
  @Get('/mapping/:cpeName')
  async mappingCve(@Param('cpeName') param: string) {
    const result = await this.service.getCveByCpeName(param);
    return result;
  }

  // @UseGuards(HttpAuthGuard)
  @Get('')
  getPagingCve(@Query() queryParams: PagingQueyDto) {
    const result = this.service.getPaging(queryParams);
    return result;
  }

  @Get(':cveId')
  async getById(@Param('cveId') cveId: string) {
    const result = await this.service.getCvebyCveId(cveId);
    return result;
  }
}
