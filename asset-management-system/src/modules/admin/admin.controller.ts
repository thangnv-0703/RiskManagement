import {
  Body,
  Controller,
  Post,
  Put,
  Get,
  Param,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { AdminService } from './admin.service';
import UpdateProfileDto from './dtos/update-profile.dto';
import { avatarStorageOptions } from './helpers/avatar-storage';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('get-admin-by-id/:id')
  // @UseGuards(JwtAuthGuard)
  async getAdminById(@Param('id') id: string) {
    return await this.adminService.getAdminById(id);
  }

  @Get('get-admin-by-username')
  async getAdminByUsername(@Body('username') username: string) {
    return await this.adminService.getAdminByUsername(username);
  }

  @Put('update-profile')
  @UseGuards(JwtAdminAuthGuard)
  async updateProfile(@Request() request, @Body() adminData: UpdateProfileDto) {
    return await this.adminService.updateProfile(request.user._id, adminData);
  }

  @Post('save-avatar')
  @UseGuards(JwtAdminAuthGuard)
  @UseInterceptors(FileInterceptor('image', avatarStorageOptions))
  async saveAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() request,
  ) {
    const res = await this.adminService.saveAvatar(request.user, file);
    return res;
  }
}
