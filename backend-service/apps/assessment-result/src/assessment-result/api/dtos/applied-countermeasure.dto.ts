import { Expose } from 'class-transformer';

export class AppliedCountermeasureDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  cost: number;

  @Expose()
  coverage: number;

  @Expose()
  coverCves: string[];
}
