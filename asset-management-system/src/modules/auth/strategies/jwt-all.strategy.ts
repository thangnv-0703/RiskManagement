import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminService } from 'src/modules/admin/admin.service';
import { UsersService } from 'src/modules/users/users.service';
import { jwtConstants } from '../auth.constant';

@Injectable()
export class JwtAllStrategy extends PassportStrategy(Strategy, 'jwt-all-auth') {
  constructor(
    private adminService: AdminService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any): Promise<any> {
    if (payload.role === 'admin') {
      const admin = await this.adminService.getAdminByUsername(
        payload.username,
      );
      // console.log(admin);
      if (!admin) {
        console.log('Not found admin');
        throw new UnauthorizedException();
      }
      return admin;
    } else if (payload.role === 'user') {
      const user = await this.usersService.getUserByUsername(payload.username);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    }
    throw new UnauthorizedException();
  }
}
