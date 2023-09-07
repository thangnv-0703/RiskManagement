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
  SystemProfileDto,
  CreateSystemProfileDto,
  UpdateSystemProfileDto,
} from './dtos';
import { Serialize } from '@libs/common/interceptors';
import { SystemProfileDIToken } from './di-token';
import { SystemProfileServicePort } from '../core/application/system-profile.service.port';
import { PagingQueyDto } from '@libs/api-contract';
import { HttpAuthGuard } from '@libs/common/guard';
import { ApiController } from '@libs/common/decorator';

@UseGuards(HttpAuthGuard)
@Serialize(SystemProfileDto)
@ApiController('system_profiles', 'System profile')
export class SystemProfileController {
  constructor(
    @Inject(SystemProfileDIToken.SystemProfileService)
    readonly service: SystemProfileServicePort
  ) {}

  /**
   * Get paging a list of system profile
   * @param queryParams paging query params
   * @returns a list of system profile
   */
  @Get('/')
  async getPaging(@Query() queryParams: PagingQueyDto) {
    const result = await this.service.getPaging(queryParams);
    return result;
  }

  /**
   * Get a system profile by id
   * @param id system profile id
   * @returns a system profile
   */
  @Get(':id')
  getById(@Param('id') id: string) {
    const result = this.service.getById(id);
    return result;
  }

  /**
   * Create a system profile
   * @param data system profile data
   * @returns a system profile id
   */
  @Post()
  async create(@Body() data: CreateSystemProfileDto) {
    return this.service.create(data);
  }

  /**
   * Update a system profile
   * @param data system profile data
   * @param id system profile id
   * @returns an updated system profile
   */
  @Put(':id')
  async update(@Body() data: UpdateSystemProfileDto, @Param('id') id: string) {
    data.id = id;
    return this.service.update(data);
  }

  /**
   * Delete a system profile
   * @param id system profile id
   * @returns true if delete success or false if delete fail
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
