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
import { LocationDto } from './dtos/location';
import { LocationService } from './location.service';

@ApiTags('location')
@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get('')
  // @UseGuards(JwtAllAuthGuard)
  async getAllLocations() {
    return await this.locationService.getAllLocations();
  }

  @Get(':id')
  // @UseGuards(JwtAllAuthGuard)
  async getLocationById(@Param('id') id: string) {
    return await this.locationService.getLocationById(id);
  }

  @Post('')
  // @UseGuards(JwtAdminAuthGuard)
  async createLocation(@Body() locationDto: LocationDto) {
    return await this.locationService.createNewLocation(locationDto);
  }

  @Put('')
  // @UseGuards(JwtAdminAuthGuard)
  async updateLocation(
    @Body('id') id: string,
    @Body() locationDto: LocationDto,
  ) {
    return await this.locationService.updateLocation(id, locationDto);
  }

  @Delete('')
  // @UseGuards(JwtAdminAuthGuard)
  async deleteLocation(@Body('id') id: string) {
    return await this.locationService.deleteLocation(id);
  }
}
