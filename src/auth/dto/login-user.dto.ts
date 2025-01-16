import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  /// Este se encarga de que tenga un password mas o menos complicado
  @IsStrongPassword()
  password: string;
}
