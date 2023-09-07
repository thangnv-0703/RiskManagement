import { Expose } from 'class-transformer';

export class DeploymentScenarioDto {
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
