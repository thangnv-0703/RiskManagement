import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAssetToInventoryDto {
  @ApiProperty()
  @IsNotEmpty()
  // @IsNumber()
  @IsString()
  assetId: string;

  @ApiProperty()
  @IsNotEmpty()
  // @IsNumber()
  @IsString()
  newStatusId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  new_cost: number;

  @ApiProperty()
  @IsNotEmpty()
  check: boolean;
}
