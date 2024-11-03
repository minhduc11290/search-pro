import { RequiredEntityData } from '@mikro-orm/core';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { UserRole } from '~/const/enums';
import { UserEntity } from '~/entities';
import { UsersService } from '../users/users.service';
import { UserCreationDto, UserLoginDto } from './dto';

@Injectable()
export default class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(userCreationDto: UserCreationDto) {
    const existedUser = await this.userService.findByEmail(
      userCreationDto.email,
    );
    if (existedUser) {
      throw new ForbiddenException('User already exists!');
    }

    const password = await argon.hash(userCreationDto.password);
    const role = await this.userService.findRole(UserRole.USER);
    const requiredData: RequiredEntityData<UserEntity> = {
      email: userCreationDto.email,
      password,
      role,
    };
    return this.userService.createUser(requiredData);
  }

  async login(userLoginDto: UserLoginDto) {
    const user = await this.userService.findByEmail(userLoginDto.email);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const isVerified = await argon.verify(user.password, userLoginDto.password);

    if (!isVerified) {
      throw new NotFoundException('Password incorrect!');
    }
    delete user.password;
    console.log(user);

    return await this.signJwtToken(user);
  }

  async signJwtToken(user: UserEntity): Promise<{ accessToken: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.role,
      stores: user.stores.map((store) => store.id),
    };

    console.log(
      this.configService.get('TOKEN_EXPIRATION'),
      this.configService.get('TOKEN_SECRET_KEY'),
    );
    const jwtToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('TOKEN_EXPIRATION'),
      secret: this.configService.get('TOKEN_SECRET_KEY'),
    });

    return {
      accessToken: jwtToken,
    };
  }
}
