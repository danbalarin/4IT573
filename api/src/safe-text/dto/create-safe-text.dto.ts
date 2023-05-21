import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSafeTextDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsString()
  domain?: string;
}
