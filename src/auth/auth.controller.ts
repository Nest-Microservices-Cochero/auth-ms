import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  /// Creamos nuestros métodos de authentication tendremos estos 3
  @MessagePattern('auth.register.user')
   registerUser() {
    return 'register user'
  }

  @MessagePattern('auth.login.user')
  loginUser() {
    return 'login user'
  }

  @MessagePattern('auth.verify.user')
  verifyToken() {
    return 'verify user'
  }

}