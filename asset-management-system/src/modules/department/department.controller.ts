import {
  Controller,
  Get,
  UseGuards,
  Post,
  Put,
  Body,
  Delete,
  Query,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { DepartmentDto } from './dtos/department.dto';
import { DepartmentService } from './department.service';
import { DepartmentQueryDto } from './dtos/departmentQuery.dto';

@ApiTags('department')
@Controller('department')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Get('')
  // @UseGuards(JwtAllAuthGuard)
  async getAllDepartments(@Query() departmentQuery: DepartmentQueryDto) {
    return await this.departmentService.getAllDepartments(departmentQuery);
  }

  @Get('id')
  // @UseGuards(JwtAllAuthGuard)
  async getDepartmentById(@Param('id') id: string) {
    return await this.departmentService.getDepartmentByDepartmentId(id);
  }

  @Post('')
  // @UseGuards(JwtAdminAuthGuard)
  async createDepartment(@Body() departmentDto: DepartmentDto) {
    return await this.departmentService.createNewDepartment(departmentDto);
  }

  @Put('')
  // @UseGuards(JwtAdminAuthGuard)
  async updateDepartment(
    @Body() departmentDto: DepartmentDto,
    @Body('id') id: string,
  ) {
    return await this.departmentService.updateDepartment(id, departmentDto);
  }

  @Delete('')
  // @UseGuards(JwtAdminAuthGuard)
  async deleteDepartment(@Body('id') id: string) {
    return await this.departmentService.deleteDepartment(id);
  }
}
