import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssetDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  purchaseCost: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  purchaseDate: Date;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  assetModelId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  departmentId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  statusId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  supplierId: string;
}
