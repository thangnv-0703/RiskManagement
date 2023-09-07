import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

// export type OrderBy = { field: string | true; param: 'asc' | 'desc' };

export class PagingQueyDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    example: 1,
    description: 'The current page',
    required: false,
  })
  current?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ example: 0, description: 'The page size ', required: false })
  pageSize?: number;

  filter?: Record<string, any>;

  // orderBy?: OrderBy;
}
