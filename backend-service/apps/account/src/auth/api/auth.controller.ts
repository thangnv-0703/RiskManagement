import { Request } from 'express';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from '@libs/common/interceptors';
import { AuthDIToken } from './di-token';
import { LoginParamDto, LoginResponseDto } from './dtos';
import { AuthServicePort } from '../core/application/auth.service.port';

@Controller('')
export class AuthController {
  constructor(
    @Inject(AuthDIToken.AuthService) private service: AuthServicePort
  ) {}

  @Serialize(LoginResponseDto)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() data: LoginParamDto) {
    return this.service.login(data.email, data.password);
  }

  @Post('logout')
  async logout() {
    return true;
  }

  @Get('current_user')
  async getCurrentUser(@Req() req: Request) {
    const token: string = req.headers['authorization']?.split(' ')[1];
    return this.service.getCurrentUser(token);
  }
}
