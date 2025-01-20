import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config/envs';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  /// Importar nuestro modulo de JWT
  imports: [
    JwtModule.register({
      //- nuestra firma 
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class AuthModule {}
