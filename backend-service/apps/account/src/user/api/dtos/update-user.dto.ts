import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class UpdateUserDto {
  @IsObjectId()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  active: boolean;
}
