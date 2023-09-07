import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AssetMaintenanceQueryDto {
  @ApiProperty()
  @IsOptional()
  // @IsNumber()
  @IsString()
  assetId: string;
}
