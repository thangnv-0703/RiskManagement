import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCountermeasureDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  coverCves: string[];
}
