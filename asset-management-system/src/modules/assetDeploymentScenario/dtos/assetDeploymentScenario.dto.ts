// import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssetDto {
  //   @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;
}
