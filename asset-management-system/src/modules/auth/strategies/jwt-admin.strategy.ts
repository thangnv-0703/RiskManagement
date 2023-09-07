import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminService } from 'src/modules/admin/admin.service';
import { jwtConstants } from '../auth.constant';
import { Admin } from 'src/models/schemas/admin.schema';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(private adminService: AdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any): Promise<Admin> {
    if (payload.role !== 'admin') {
      console.log('Unauthorized access: User access not allowed');
      throw new UnauthorizedException();
    }
    const user = await this.adminService.getAdminByUsername(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
