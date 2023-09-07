import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class SourceCodeToUserQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  sourceCodeId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  userId: string;
}
