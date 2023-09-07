import {
  Controller,
  Get,
  UseGuards,
  Post,
  Put,
  Body,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { JwtAllAuthGuard } from '../auth/guards/jwt-all-auth.guard';
import { CheckinSourceCodeDto } from './dtos/checkinSourceCode.dto';
import { CheckoutSourceCodeDto } from './dtos/checkoutSourceCode.dto';
import { SourceCodeDto } from './dtos/sourceCode.dto';
import { SourceCodeToUserQueryDto } from './dtos/sourceCodeToUser.dto';
import { SourceCodeService } from './sourceCode.service';

@ApiTags('source-code')
@Controller('source-code')
export class SourceCodeController {
  constructor(private sourceCodeService: SourceCodeService) {}

  @Get('')
  // @UseGuards(JwtAllAuthGuard)
  async getAllSourceCodes() {
    return await this.sourceCodeService.getAllSourceCodes();
  }

  @Get(':id')
  // @UseGuards(JwtAllAuthGuard)
  async getSourceCodeById(@Param('id') id: string) {
    return await this.sourceCodeService.getSourceCodeById(id);
  }

  @Get('source-code-to-user')
  // @UseGuards(JwtAdminAuthGuard)
  async getSourceCodeToUser(
    @Query() sourceCodeToUserDto: SourceCodeToUserQueryDto,
  ) {
    return await this.sourceCodeService.getSourceCodeToUser(
      sourceCodeToUserDto,
    );
  }

  @Post('')
  // @UseGuards(JwtAdminAuthGuard)
  async createSourceCode(@Body() sourceCodeDto: SourceCodeDto) {
    return await this.sourceCodeService.createNewSourceCode(sourceCodeDto);
  }

  @Put('')
  // @UseGuards(JwtAdminAuthGuard)
  async updateSourceCode(
    @Body() sourceCodeDto: SourceCodeDto,
    @Body('id') id: string,
  ) {
    return await this.sourceCodeService.updateSourceCode(id, sourceCodeDto);
  }

  @Delete('')
  // @UseGuards(JwtAdminAuthGuard)
  async deleteSourceCode(@Body('id') id: string) {
    return await this.sourceCodeService.deleteSourceCode(id);
  }

  @Post('checkout-source-code')
  // @UseGuards(JwtAdminAuthGuard)
  async checkoutSourceCode(
    @Body() checkoutSourceCodeDto: CheckoutSourceCodeDto,
  ) {
    return await this.sourceCodeService.checkoutSourceCode(
      checkoutSourceCodeDto,
    );
  }

  @Post('checkin-source-code')
  // @UseGuards(JwtAdminAuthGuard)
  async checkinSourceCode(@Body() checkinSourceCodeDto: CheckinSourceCodeDto) {
    return await this.sourceCodeService.checkinSourceCode(checkinSourceCodeDto);
  }
}
