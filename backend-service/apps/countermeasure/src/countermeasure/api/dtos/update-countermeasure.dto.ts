import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCountermeasureDto {
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  coverCves: string[];
}
