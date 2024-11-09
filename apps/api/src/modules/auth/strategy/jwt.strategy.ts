import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '~/modules/users/users.service';
import TokenService from '../token.service';
import { UserLoginDto } from '../dto';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('TOKEN_SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  //FIXME: remove type unknown
  async validate(req: Request, payload: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = authHeader.split(' ')[1];
    if (await this.tokenService.isInBlacklist(token)) {
      throw new UnauthorizedException('Token has been blacklisted');
    }
    const user = await this.userService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    delete user.password;
    return user;
  }
}
