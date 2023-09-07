import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class InventoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  start_date: Date;

  @ApiProperty()
  @IsOptional()
  end_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  departmentId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note: string;
}
