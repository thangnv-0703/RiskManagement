import { HttpAuthGuard } from '@libs/common/guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PagingQueyDto } from '@libs/api-contract';
import { Serialize } from '@libs/common/interceptors';
import { CweDto } from './dtos/cwe.dto';
import { CweServicePort } from '../core/application/cwe.service.port';
import { CategoryDIToken } from './di-token';

@UseGuards(HttpAuthGuard)
@Serialize(CweDto)
@Controller('cwes')
export class CweController {
  constructor(
    @Inject(CategoryDIToken.CweService) readonly service: CweServicePort
  ) {}

  @Get('')
  getPagingCwe(@Query() queryParams: PagingQueyDto) {
    const result = this.service.getPaging(queryParams);
    return result;
  }

  @Serialize(CweDto)
  @Get(':id')
  getCweById(@Param('id') id: string) {
    return this.service.getCwebyCweId(id);
  }

  // @Serialize(CpeMappingDto)
  // @Get('cpes/:keyword')
  // mappingCpe(@Param('keyword') keyword: string) {
  //   return this.service.mappingCpe(keyword);
  // }
}
