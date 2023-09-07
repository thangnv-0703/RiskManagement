import { Module } from '@nestjs/common';
import { AuthDIToken } from './api/di-token';
import { AuthService } from './core/application/auth.service';
import { UserRepository } from '../user/infrastructure/repositories/user.repository';
import { AuthMessageHandler } from './api/auth.message.handler';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './infrastructure/jwt/jwt-strategy';
import { User, UserSchema } from '../user/core/domain/user';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './api/auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'asdf',
      signOptions: {
        expiresIn: 600000 * 24,
      },
    }),
  ],
  controllers: [AuthMessageHandler, AuthController],
  providers: [
    JwtStrategy,
    {
      provide: AuthDIToken.AuthService,
      useClass: AuthService,
    },
    {
      provide: AuthDIToken.UserRepository,
      useClass: UserRepository,
    },
  ],
})
export class AuthModule {}
