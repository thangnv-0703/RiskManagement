import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  // @IsNumber()
  @IsString()
  itemId: string;

  @ApiProperty()
  @IsNotEmpty()
  expiration_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string;
}
