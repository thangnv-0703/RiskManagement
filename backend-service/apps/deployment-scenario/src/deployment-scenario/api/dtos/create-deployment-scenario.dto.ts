import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { CreateAppliedCountermeasureDto } from './create-applied-countermeasure.dto';
import { UpdateAssetCpeDto } from './update-asset-cpe.dto';
import {
  AccessVector,
  CIALevel,
  DeploymentScenarioStatus,
  Privilege,
} from '../../core/domain/enums';

class SecurityGoalDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  assetId: string;

  @IsNotEmpty()
  @IsEnum(CIALevel)
  confidentiality: string;

  @IsNotEmpty()
  @IsEnum(CIALevel)
  integrity: string;

  @IsNotEmpty()
  @IsEnum(CIALevel)
  availability: string;
}

class AssetRelationshipDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsNotEmpty()
  target: string;

  @IsEnum(AccessVector)
  @IsNotEmpty()
  accessVector: string;

  @IsEnum(Privilege)
  @IsNotEmpty()
  privilege: string;
}

export class CreateDeploymentScenarioDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsEnum(DeploymentScenarioStatus)
  status: string;

  @IsString()
  @IsNotEmpty()
  systemProfileId: string;

  @IsString()
  @IsNotEmpty()
  systemProfileName: string;

  @ValidateNested()
  @Type(() => SecurityGoalDto)
  securityGoals: SecurityGoalDto[];

  @ValidateNested()
  @Type(() => UpdateAssetCpeDto)
  assets: UpdateAssetCpeDto[];

  @ValidateNested()
  @Type(() => AssetRelationshipDto)
  assetRelationships: AssetRelationshipDto[];

  @ValidateNested()
  @Type(() => CreateAppliedCountermeasureDto)
  countermeasures: CreateAppliedCountermeasureDto[];
}
