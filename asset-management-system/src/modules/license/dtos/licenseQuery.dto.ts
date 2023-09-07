import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class LicenseQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  manufacturerId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  supplierId: string;
}
