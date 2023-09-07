import { Expose } from 'class-transformer';

export class CweDto {
  @Expose()
  cwe_id: string;

  @Expose()
  cwe_name: string;

  @Expose()
  description: string;
}
