import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class LicenseToAssetQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  assetId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  licenseId: string;

  // @ApiProperty()
  // @IsOptional()
  // @IsBoolean()
  // withDeleted: boolean;
}
