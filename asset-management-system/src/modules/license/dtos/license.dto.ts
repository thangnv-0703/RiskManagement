import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LicenseDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  purchaseCost: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  purchaseDate: Date;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  expirationDate: Date;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  seats: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  manufacturerId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  supplierId: string;
}
