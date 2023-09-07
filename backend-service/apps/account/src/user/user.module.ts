import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './core/domain/user';
import { UserDIToken } from './api/di-token';
import { UserService } from './core/application/user.service';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserMessageHandler } from './api/user.message.handler';
import { ContextService } from '@libs/common/context';
import { UserController } from './api/user.controller';
import { AuthService } from '../auth/core/application/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'asdf',
      signOptions: {
        expiresIn: 600000 * 24,
      },
    }),
  ],
  controllers: [UserMessageHandler, UserController],
  providers: [
    {
      provide: UserDIToken.UserService,
      useClass: UserService,
    },
    {
      provide: UserDIToken.UserRepository,
      useClass: UserRepository,
    },
    {
      provide: UserDIToken.ContextService,
      useClass: ContextService,
    },
    {
      provide: UserDIToken.AuthService,
      useClass: AuthService,
    },
  ],
})
export class UserModule {}
