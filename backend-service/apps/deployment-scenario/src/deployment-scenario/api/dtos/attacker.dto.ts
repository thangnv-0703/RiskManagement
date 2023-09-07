import { Expose, Type } from 'class-transformer';

class AttackerTargetDto {
  @Expose()
  assetId: string;

  @Expose()
  attackVector: string;

  @Expose()
  privilege: string;
}

export class AttackerDto {
  @Expose()
  id?: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  type: string;

  @Expose()
  @Type(() => AttackerTargetDto)
  targets: AttackerTargetDto[];

  @Expose()
  deploymentScenario: string;
}
