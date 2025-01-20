import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { RegisterUserDto } from './dto/register-user.dto';

/// importamos bcrypt
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { envs } from 'src/config/envs';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly jwtService: JwtService
  ){
    super()
  }

  async signJWT( payload: JwtPayload){
    return this.jwtService.sign(payload)
  }

  /// Crear método, para validar el token
  async verifyToken(token: string){
    try {
      const {sub, iat, exp, ...user} = await this.jwtService.verify(token,{
        secret: envs.jwtSecret
      });
      return {
        user,
        /// ESTO ES OPCIONAL, Podemos aprovechar y activar otro token que lo va a hacer valido por 1h o el tiempo que especificamos
        token : await this.signJWT(user),
      };
    } catch (error) {
      this.logger.error('Error al verificar token', error);
      throw new RpcException({
        status: 401,
        message: 'Invalid token',
      });
    }
  }

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }
  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, name, password } = registerUserDto;
    try {
      const user = await this.user.findUnique({
        where: {
          email: email,
        },
      });

      if (user) {
        throw new RpcException({
          status: 400,
          message: 'Email already exists',
        });
      }

      const newUser = await this.user.create({
        data: {
          email,
          name,
          /// hasheamos la contraseña
          password: bcrypt.hashSync(password, 10), // todo: encriptar / hash
        },
      });

      /// no enviar el password
      const { password: __, ...rest } = newUser;

      return {
        message: 'User registered successfully',
        user: rest,
        /// Firmar o Genera token
        token: await this.signJWT(rest), // todo: generar token
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    try {

      /// Buscar el usuario
      const user = await this.user.findUnique({
        where: {
          email,
        },
      });

      /// Encontrar
      if (!user) {
        throw new RpcException({
          status: 400,
          message: 'User/Password incorrect',
        });
      }

      /// comparar la contraseña
      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        throw new RpcException({
          status: 400,
          message: 'User/Password incorrect',
        });
      }

      const { password: __, ...rest } = user;

      return {
        user: rest,
        ///
        token: await this.signJWT(rest),
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
