import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

/**
 * Main validation happens in auth/dto
 */
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
