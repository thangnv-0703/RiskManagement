import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

class AttackerTargetDto {
  @IsString()
  assetId: string;

  @IsString()
  attackVector: string;

  @IsString()
  privilege: string;
}

export class CreateAttackerDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => AttackerTargetDto)
  targets: AttackerTargetDto[];

  deploymentScenario: string;
}
