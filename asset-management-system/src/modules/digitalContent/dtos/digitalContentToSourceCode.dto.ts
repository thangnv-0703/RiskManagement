import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class DigitalContentToSourceCodeQueryDto {
  @ApiProperty()
  @IsOptional()
  // @IsNumber()
  @IsString()
  digitalContentId: string;

  @ApiProperty()
  @IsOptional()
  // @IsNumber()
  @IsString()
  sourceCodeId: number;

  // @ApiProperty()
  // @IsOptional()
  // @IsBoolean()
  // withDeleted: boolean;
}
