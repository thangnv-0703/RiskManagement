import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UserQueryDto {
  @ApiProperty()
  @IsOptional()
  // @IsNumber()
  @IsString()
  departmentId: string;
}
