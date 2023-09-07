import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AssetHistoryQueryDto {
  @ApiProperty()
  @IsOptional()
  // @IsNumber()
  @IsString()
  assetId: string;

  @ApiProperty()
  @IsOptional()
  // @IsNumber()
  @IsString()
  userId: string;
}
