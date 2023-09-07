import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateSystemProfileDto {
  @IsString()
  @IsNotEmpty()
  /**
   * A string as system profile name
   * @example 'dxclan'
   */
  name: string;

  @IsString()
  @IsNotEmpty()
  /**
   * A string as system profile description
   * @example 'a digital transformation system'
   */
  description: string;

  @IsObject()
  @IsOptional()
  /**
   * An object with key-value pair as system profile custom fields
   * @example { "domain": ["logistic"] }
   */
  customFields: object;
}
