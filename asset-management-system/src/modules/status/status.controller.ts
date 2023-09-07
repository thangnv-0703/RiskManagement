import {
  Controller,
  Get,
  UseGuards,
  Post,
  Put,
  Body,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { StatusDto } from './dtos/status.dto';
import { StatusService } from './status.service';

@ApiTags('status')
@Controller('status')
export class StatusController {
  constructor(private statusService: StatusService) {}

  @Get('')
  // @UseGuards(JwtAllAuthGuard)
  async getAllStatuses() {
    return await this.statusService.getAllStatuses();
  }

  @Get(':id')
  // @UseGuards(JwtAllAuthGuard)
  async getStatusById(@Param('id') id: string) {
    return await this.statusService.getStatusById(id);
  }

  @Post('')
  // @UseGuards(JwtAdminAuthGuard)
  async createStatus(@Body() statusDto: StatusDto) {
    return await this.statusService.createNewStatus(statusDto);
  }

  @Put('')
  // @UseGuards(JwtAdminAuthGuard)
  async updateStatus(@Body() statusDto: StatusDto, @Body('id') id: string) {
    return await this.statusService.updateStatus(id, statusDto);
  }

  @Delete('')
  // @UseGuards(JwtAdminAuthGuard)
  async deleteStatus(@Body('id') id: string) {
    return await this.statusService.deleteStatus(id);
  }
}
