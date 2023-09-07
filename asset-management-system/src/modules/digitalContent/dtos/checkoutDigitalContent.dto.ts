import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckoutDigitalContentDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  digitalContentId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  sourceCodeId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  checkout_date: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  checkout_note: string;
}
