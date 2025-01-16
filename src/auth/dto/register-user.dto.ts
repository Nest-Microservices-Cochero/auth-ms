import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class RegisterUserDto {
  //- este tiene el nombre a diferencia del otro
  @IsString()
  name: string;
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  /// Este se encarga de que tenga un password mas o menos complicado
  @IsStrongPassword()
  password: string;
}
