import { EntityManager } from '@mikro-orm/core';
import { GoneException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { RoleEntity, UserEntity } from '~/entities';
import { UserResponseMapper } from '~/mappers/responses/UserResponseMapper';
import { UserLoginDto, UserLoginResponseDto } from '../../../share/dtos';
import TokenService from '../../share/auth/token.service';
import { UserRole } from '~/share/consts/enums';

@Injectable()
export default class AdminUserService {
  constructor(
    private readonly em: EntityManager,
    private readonly tokenService: TokenService,
  ) { }

  async login(userLoginDto: UserLoginDto): Promise<UserLoginResponseDto> {
    console.log("userLoginDto", userLoginDto);
    const user = await this.em.findOne(
      UserEntity,
      {
        email: userLoginDto.email,
      },
      { populate: ['role', 'stores'] },
    );
    console.log("user", user);
    if (!user?.isActive() || !(user?.isSuperAdmin() || user?.isAdmin())) {
      throw new GoneException('User not found!');
    }

    const isVerified = await argon.verify(
      user.password ?? '',
      userLoginDto.password,
    );

    if (!isVerified) {
      throw new GoneException('Password incorrect!');
    }

    const tokenData = await this.tokenService.signJwtToken(
      new UserResponseMapper().map(user),
    );
    await this.tokenService.blacklistPreviousToken(user.id);
    await this.tokenService.toInuse(user.id, tokenData.accessToken);
    console.log("end");
    return tokenData;
  }

  async findByEmail(email: string) {
    return this.em.findOne(UserEntity, { email: email.trim() });
  }


  async findByEmailAdmin(email: string) {
    const role = await this.em.findOneOrFail(RoleEntity, {
      role: UserRole.ADMIN,
    });

    return this.em.findOne(UserEntity, { email: email.trim(), role: role.id });
  }

  async findByEmailStore(email: string) {
    const role = await this.em.findOneOrFail(RoleEntity, {
      role: UserRole.STORE_OWNER,
    });
    return this.em.findOne(UserEntity, { email: email.trim(), role: role.id });
  }

  async checkIsSuperAdmin(id: string): Promise<boolean> {
    const _user = await this.em.findOne(UserEntity, { id: id });
    return _user?.isSuperAdmin() ?? false;
  }

  async checkIsAdmin(id: string): Promise<boolean> {
    const _user = await this.em.findOne(UserEntity, { id: id });
    return _user?.isAdmin() ?? false;
  }

  async updateEmailStore(id: string, email: string) {
    // return this.em.nativeUpdate(UserEntity, { email: email.trim(), role: role.id });

    const user = await this.em.findOneOrFail(UserEntity, { id: id });
    user.assign({ email: email });
    await this.em.persistAndFlush(user);
    return user;
  }
}
