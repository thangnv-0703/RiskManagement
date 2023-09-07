import { Expose } from 'class-transformer';

export class CountermeasureDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  coverCves: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
