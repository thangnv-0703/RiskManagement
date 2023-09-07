import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAppliedCountermeasureDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @IsNumber()
  @IsNotEmpty()
  coverage: number;

  @IsArray()
  @IsNotEmpty()
  coverCves: string[];

  deploymentScenario: string;
}
