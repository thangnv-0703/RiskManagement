import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NewRequestAsset {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note: string;
}
