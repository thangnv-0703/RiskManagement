import { Expose, Type } from 'class-transformer';
import { AttackerDto } from './attacker.dto';
import { AppliedCountermeasureDto } from './applied-countermeasure.dto';
import { AssetCveDto } from './asset-cve.dto';
import { AssetCpeDto } from './asset-cpe.dto';
import { AttackGraphDto } from './attack-graph.dto';

export class SecurityGoalDto {
  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  assetId: string;

  @Expose()
  confidentiality: string;

  @Expose()
  integrity: string;

  @Expose()
  availability: string;
}

class AssetRelationshipDto {
  @Expose()
  name: string;

  @Expose()
  source: string;

  @Expose()
  target: string;

  @Expose()
  accessVector: string;

  @Expose()
  privilege: string;
}

export class DeploymentScenarioDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  status: string;

  @Expose()
  systemProfileId: string;

  @Expose()
  systemProfileName: string;

  @Expose()
  @Type(() => SecurityGoalDto)
  securityGoals: SecurityGoalDto[];

  @Expose()
  @Type(() => AssetCpeDto)
  assets: AssetCpeDto[];

  @Expose()
  @Type(() => AssetRelationshipDto)
  assetRelationships: AssetRelationshipDto[];

  @Expose()
  @Type(() => AppliedCountermeasureDto)
  countermeasures: AppliedCountermeasureDto[];

  @Expose()
  @Type(() => AttackerDto)
  attackers: AttackerDto[];

  @Expose()
  @Type(() => AssetCveDto)
  cves: AssetCveDto[];

  @Expose()
  @Type(() => AttackGraphDto)
  attackGraph: AttackGraphDto;

  @Expose()
  exploitability: string;

  @Expose()
  remediationLevel: string;

  @Expose()
  reportConfidence: string;

  @Expose()
  baseImpact: number;

  @Expose()
  baseBenefit: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class DeploymentScenarioListDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  status: string;

  @Expose()
  description: string;

  @Expose()
  systemProfileId: string;

  @Expose()
  systemProfileName: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
