import { Exclude, Expose } from 'class-transformer';

export class CveDto {
  @Expose()
  cve_id: string;

  @Expose()
  cwe_id: string;

  @Expose()
  description: string;

  @Expose()
  impact: string;

  // @Exclude()
  // configurations: any[];

  // @Exclude()
  // publishedDate: string;

  // @Exclude()
  // lastModifiedDate: string;

  // @Exclude()
  // attackVector: string;

  // @Exclude()
  // condition: object;

  // @Exclude()
  // cpe: any[];
}
