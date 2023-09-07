import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CurrentUser } from '../../api/dtos/current-user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'asdf',
    });
  }

  validate(payload: CurrentUser) {
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
