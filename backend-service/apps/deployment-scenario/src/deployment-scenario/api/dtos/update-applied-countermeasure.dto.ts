import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateAppliedCountermeasureDto {
  id: string;

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
