import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AssetMaintenanceDto {
  @ApiProperty({ required: true })
  // @IsNumber()
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({ required: true })
  // @IsNumber()
  @IsString()
  @IsNotEmpty()
  supplierId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  start_date: Date;

  @ApiProperty()
  @IsOptional()
  end_date: Date;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  cost: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note: string;
}
