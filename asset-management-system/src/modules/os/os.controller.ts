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
import { OSService } from './os.service';
import { OSDto } from './dtos/os.dto';

@ApiTags('os')
@Controller('os')
export class OSController {
  constructor(private osService: OSService) {}

  @Get('')
  async getAllOSes() {
    return await this.osService.getAllOSes();
  }

  @Get(':id')
  async getOSById(@Param('id') id: string) {
    return await this.osService.getOSById(id);
  }

  @Post('')
  async createOS(@Body() osDto: OSDto) {
    return await this.osService.createNewOS(osDto);
  }

  @Put('')
  async updateOS(@Body('id') id: string, @Body() osDto: OSDto) {
    return await this.osService.updateOS(id, osDto);
  }

  @Delete('')
  async deleteOS(@Body('id') id: string) {
    return await this.osService.deleteOS(id);
  }
}
