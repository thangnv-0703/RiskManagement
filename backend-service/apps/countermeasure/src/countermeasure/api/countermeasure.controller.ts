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
import {
  CountermeasureDto,
  CreateCountermeasureDto,
  UpdateCountermeasureDto,
} from './dtos';
import { Serialize } from '@libs/common/interceptors';
import { PagingQueyDto } from '@libs/api-contract';
import { CountermeasureDIToken } from './di-token';
import { CountermeasureServicePort } from '../core/application/countermeasure.service.port';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(HttpAuthGuard)
@Serialize(CountermeasureDto)
@ApiTags('Countermeasure')
@Controller('countermeasures')
export class CountermeasureController {
  constructor(
    @Inject(CountermeasureDIToken.CountermeasureService)
    readonly service: CountermeasureServicePort
  ) {}

  /**
   * Get paging a list of countermeasure
   * @param queryParams paging query params
   * @returns A list of countermeasure
   */
  @Get()
  getPaging(@Query() queryParams: PagingQueyDto) {
    const result = this.service.getPaging(queryParams);
    return result;
  }

  /**
   * Get a countermeasure by id
   * @param id countermeasure id
   * @returns a countermeasure
   */
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  /**
   * Create a countermeasure
   * @param data countermeasure data
   * @returns id of the created countermeasure
   */
  @Post()
  async create(@Body() data: CreateCountermeasureDto) {
    return this.service.create(data);
  }

  /**
   * Update a countermeasure
   * @param data countermeasure data
   * @param id countermeasure id
   * @returns updated countermeasure
   */
  @Put(':id')
  async update(@Body() data: UpdateCountermeasureDto, @Param('id') id: string) {
    data.id = id;
    return this.service.update(data);
  }

  /**
   * Delete a countermeasure
   * @param id countermeasure id
   * @returns true if deleted successfully otherwise false
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
