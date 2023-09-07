import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AssetModelQueryDto {
  @ApiProperty()
  @IsOptional()
  // @IsNumber()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsOptional()
  // @IsNumber()
  @IsString()
  manufacturerId: string;
}
