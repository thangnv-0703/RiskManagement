import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SaveEdgeDto {
  @IsString()
  id: string;

  @IsString()
  source: string;

  @IsString()
  target: string;

  @IsNumber()
  @IsOptional()
  index?: number;

  @IsArray()
  phase: number[];
}

export class SaveNodeDto {
  @IsString()
  id: string;

  @IsNumber()
  @IsOptional()
  x?: number;

  @IsNumber()
  @IsOptional()
  y?: number;

  @IsString()
  label: string;

  @IsString()
  type: string;

  @IsString()
  shape: string;

  @IsBoolean()
  @IsOptional()
  isAttacker?: boolean;

  @IsBoolean()
  @IsOptional()
  isAsset?: boolean;

  @IsString()
  @IsOptional()
  attackerId?: string;

  @IsString()
  @IsOptional()
  assetId?: string;

  @IsString()
  @IsOptional()
  cveId?: string;

  @IsString()
  color: string;

  @IsNumber()
  @IsOptional()
  index?: number;

  @IsArray()
  phase: number[];
}

export class UpdateAttackGraphDto {
  @ValidateNested({ each: true })
  @Type(() => SaveNodeDto)
  nodes: SaveNodeDto[];

  @ValidateNested({ each: true })
  @Type(() => SaveEdgeDto)
  edges: SaveEdgeDto[];
}

export class SaveAttackGraphDto {
  @ValidateNested({ each: true })
  @Type(() => UpdateAttackGraphDto)
  attackGraph: UpdateAttackGraphDto;

  id: string;
}
