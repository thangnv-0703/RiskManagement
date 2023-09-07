import { Expose } from 'class-transformer';

export class CpeDto {
  @Expose()
  name: string;
}
