import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PagingQueyDto } from '@libs/api-contract';
import { Serialize } from '@libs/common/interceptors';
import { CreateUserDto, UpdateUserDto, UserDto } from './dtos';
import { UserDIToken } from './di-token';
import { UserServicePort } from '../core/application/user.service.port';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guard/auth.guard';

@ApiTags('User')
@UseGuards(AuthGuard)
@Controller('admin/users')
export class UserController {
  constructor(
    @Inject(UserDIToken.UserService) private service: UserServicePort
  ) {}
  @Serialize(UserDto)
  @Get('')
  getPaging(@Query() queryParams: PagingQueyDto) {
    const result = this.service.getPaging(queryParams);
    return result;
  }

  /* Creating a new entity. */

  @Serialize(UserDto)
  @Post('')
  async create(@Body() data: CreateUserDto) {
    return this.service.create(data);
  }

  /* Updating the entity with the id. */
  @Serialize(UserDto)
  @Put('')
  async update(@Body() data: UpdateUserDto) {
    return this.service.update(data);
  }
}
