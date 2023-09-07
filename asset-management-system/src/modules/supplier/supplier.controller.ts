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
import { SupplierDto } from './dtos/supplier.dto';
import { SupplierService } from './supplier.service';

@ApiTags('supplier')
@Controller('supplier')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Get('')
  // @UseGuards(JwtAllAuthGuard)
  async getAllSuppliers() {
    return await this.supplierService.getAllSuppliers();
  }

  @Get(':id')
  // @UseGuards(JwtAllAuthGuard)
  async geSupplierById(@Param('id') id: string) {
    return await this.supplierService.getSupplierById(id);
  }

  // @UseGuards(JwtAdminAuthGuard)
  @Post('')
  async createSupplier(@Body() supplierDto: SupplierDto) {
    return await this.supplierService.createNewSupplier(supplierDto);
  }

  @Put('')
  // @UseGuards(JwtAdminAuthGuard)
  async updateSupplier(
    @Body() supplierDto: SupplierDto,
    @Body('id') id: string,
  ) {
    return await this.supplierService.updateSupplier(id, supplierDto);
  }

  @Delete('')
  // @UseGuards(JwtAdminAuthGuard)
  async deleteSupplier(@Body('id') id: string) {
    return await this.supplierService.deleteSupplier(id);
  }
}
