import {
  Controller,
  Get,
  UseGuards,
  Post,
  Put,
  Body,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { imageStorageOptions } from 'src/helpers/imageStorage';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { ManufacturerDto } from './dtos/manufacturer.dto';
import { ManufacturerService } from './manufacturer.service';

@ApiTags('manufacturer')
@Controller('manufacturer')
export class ManufacturerController {
  constructor(private manufacturerService: ManufacturerService) {}

  @Get('')
  // @UseGuards(JwtAllAuthGuard)
  async getAllManufacturers() {
    return await this.manufacturerService.getAllManufacturers();
  }

  @Get(':id')
  // @UseGuards(JwtAllAuthGuard)
  async getManufacturerById(@Param('id') id: string) {
    return await this.manufacturerService.getManufacturerById(id);
  }

  @Post('')
  // @UseGuards(JwtAdminAuthGuard)
  async createManufacturer(@Body() manufacturerDto: ManufacturerDto) {
    return await this.manufacturerService.createNewManufacturer(
      manufacturerDto,
    );
  }

  @Post('save-image')
  // @UseGuards(JwtAdminAuthGuard)
  @UseInterceptors(FileInterceptor('image', imageStorageOptions))
  async saveImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('id') id: string,
  ) {
    const res = await this.manufacturerService.saveImage(id, file);
    return res;
  }

  @Put('')
  // @UseGuards(JwtAdminAuthGuard)
  async updateManufacturer(
    @Body() manufacturerDto: ManufacturerDto,
    @Body('id') id: string,
  ) {
    return await this.manufacturerService.updateManufacturer(
      id,
      manufacturerDto,
    );
  }

  @Delete('')
  // @UseGuards(JwtAdminAuthGuard)
  async deleteManufacturer(@Body('id') id: string) {
    return await this.manufacturerService.deleteManufacturer(id);
  }
}
