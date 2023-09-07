import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AssetQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  assetModelId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  departmentId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  statusId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  supplierId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  userId: string;
}
