import { Exclude, Expose } from 'class-transformer';
import { DeploymentScenario } from '../documents';

@Exclude()
export class DeploymentScenarioEventDto {
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

  @Expose() assets: [];

  @Expose() cves: [];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  createdBy: string;

  @Expose()
  updatedBy: string;

  @Expose()
  __v: number;

  // @Exclude() securityGoals: [];

  // @Exclude() assets: [];

  // @Exclude() assetRelationships: [];

  // @Exclude() countermeasures: [];

  // @Exclude() attackers: [];

  // @Exclude() cves: [];

  // @Exclude() attackGraph: object;

  // @Exclude()
  // exploitability: string;

  // @Exclude()
  // remediationLevel: string;

  // @Exclude()
  // reportConfidence: string;

  // @Exclude() baseImpact: number;

  // @Exclude() baseBenefit: number;
}
