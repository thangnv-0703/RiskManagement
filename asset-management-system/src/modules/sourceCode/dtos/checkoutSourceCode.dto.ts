import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckoutSourceCodeDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  sourceCodeId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  start_date: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  start_note: string;
}
