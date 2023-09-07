import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApplicationService } from './application.service';
import { ApplicationDto } from './dtos/application.dto';

@ApiTags('application')
@Controller('application')
export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  @Get('')
  async getAllApplications() {
    return await this.applicationService.getAllApplications();
  }

  @Get(':id')
  async getApplicationById(@Param('id') id: string) {
    return await this.applicationService.getApplicationById(id);
  }

  @Post('')
  async createApplication(@Body() applicationDto: ApplicationDto) {
    return await this.applicationService.createNewApplication(applicationDto);
  }

  @Put('')
  async updateApplication(
    @Body('id') id: string,
    @Body() applicationDto: ApplicationDto,
  ) {
    return await this.applicationService.updateApplication(id, applicationDto);
  }

  @Delete('')
  async deleteApplication(@Body('id') id: string) {
    return await this.applicationService.deleteApplication(id);
  }
}
