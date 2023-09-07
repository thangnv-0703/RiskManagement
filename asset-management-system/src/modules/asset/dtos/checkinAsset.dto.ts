import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckinAssetDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  statusId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  departmentId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  checkin_date: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  checkin_note: string;
}
