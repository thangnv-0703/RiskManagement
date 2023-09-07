import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class DepartmentQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  locationId: string;
}
