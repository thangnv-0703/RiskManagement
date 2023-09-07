import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckoutAssetDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  statusId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  checkout_date: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  checkout_note: string;
}
