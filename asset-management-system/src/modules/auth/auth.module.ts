import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { jwtConstants } from './auth.constant';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { AdminModule } from '../admin/admin.module';
import { LocalAdminStrategy } from './strategies/local-admin.strategy';
import { JwtAdminStrategy } from './strategies/jwt-admin.strategy';
import { JwtAllStrategy } from './strategies/jwt-all.strategy';

@Module({
  imports: [
    UsersModule,
    AdminModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '86400s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    LocalAdminStrategy,
    JwtAdminStrategy,
    JwtAllStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
