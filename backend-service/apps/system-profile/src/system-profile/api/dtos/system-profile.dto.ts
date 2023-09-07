import { Expose } from 'class-transformer';

export class SystemProfileDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  customFields: object;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
