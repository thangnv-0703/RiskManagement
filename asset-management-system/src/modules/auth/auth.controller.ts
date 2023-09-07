import {
  Controller,
  Body,
  Post,
  Get,
  Request,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import RegisterDto from './dtos/register.dto';
import { ApiTags } from '@nestjs/swagger';
import RequestWithUser from './interfaces/request-with-user.interface';
import RequestWithAdmin from './interfaces/request-with-admin.interface';
import ChangePasswordDto from './dtos/change-passord.dto';
import { LocalAdminAuthGuard } from './guards/local-admin-auth.guard';
import { JwtAdminAuthGuard } from './guards/jwt-admin-auth.guard';
import { Document } from 'mongoose';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  authenticate(@Request() request: RequestWithUser) {
    const user = request.user;
    const userData = user.toObject();
    return userData;
  }

  @UseGuards(JwtAdminAuthGuard)
  @Get('admin')
  @UseInterceptors(ClassSerializerInterceptor)
  authenticateAdmin(@Request() request: RequestWithAdmin) {
    const admin = request.user as Document;
    const { _id, ...rest } = admin.toObject();
    return { _id: _id.toString(), ...rest };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request: RequestWithUser) {
    return this.authService.login(request.user);
  }

  @UseGuards(LocalAdminAuthGuard)
  @Post('login-admin')
  async loginAdmin(@Request() request: RequestWithAdmin) {
    return this.authService.login(request.user);
  }

  @UseGuards(JwtAdminAuthGuard)
  @Post('create-user')
  async createUser(@Body() createUserDto: RegisterDto) {
    const user = await this.authService.createUser(createUserDto);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Request() request: RequestWithUser,
    @Body(new ValidationPipe()) changePassword: ChangePasswordDto,
  ) {
    await this.authService.changePassword(
      request.user.username,
      request.user.password,
      changePassword.currentPassword,
      changePassword.newPassword,
    );
  }

  @UseGuards(JwtAdminAuthGuard)
  @Post('change-password-admin')
  async changePasswordAdmin(
    @Request() request,
    @Body(new ValidationPipe()) changePassword: ChangePasswordDto,
  ) {
    await this.authService.changePasswordAdmin(
      request.user.username,
      request.user.password,
      changePassword.currentPassword,
      changePassword.newPassword,
    );
  }
}
