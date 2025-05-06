import { EntityManager, FilterQuery } from '@mikro-orm/core';
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
    let filter = {};
    if (userLoginDto.type && userLoginDto.type == "STORE") {
      let _roles = await this.em.find(RoleEntity, {
        role: { $in: [UserRole.STORE_OWNER] },
      });
      filter = {
        email: userLoginDto.email,
        role: { $in: _roles.map((role) => role.id) }   // Chỉ cho phép ADMIN và STORE_OWNER
      };
    } else {
      let _roles = await this.em.find(RoleEntity, {
        role: { $in: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
      });
      filter = {
        email: userLoginDto.email,

        role: { $in: _roles.map((role) => role.id) }  // Chỉ cho phép ADMIN và STORE_OWNER
      };
    }


    const users = await this.em.find(
      UserEntity,
      filter,
      { populate: ['role', 'stores'] },
    );
    console.log("users", users);
    let _user: UserEntity | null = null;
    let id = '';

    for (const user of users) {

      if (!user?.isActive() || !(user?.isSuperAdmin() || user?.isAdmin() || user?.isStoreOwner())) {
        throw new GoneException('User not found!');
      }

      const isVerified = await argon.verify(
        user.password ?? '',
        userLoginDto.password,
      );
      console.log("user.password", user.password)
      console.log("userLoginDto.password", userLoginDto.password)
      console.log("isVerified", isVerified)
      if (!isVerified) {
        // throw new GoneException('Password incorrect!');
      } else {
        _user = user;
        id = user.id;

      }
    };

    if (!_user) {
      throw new GoneException('User not found!');

    }
    const tokenData = await this.tokenService.signJwtToken(
      new UserResponseMapper().map(_user),
    );
    await this.tokenService.blacklistPreviousToken(id);
    await this.tokenService.toInuse(id, tokenData.accessToken);
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

  async findByIds(
    createdByIds: string[]
  ): Promise<UserEntity[]> {
    return this.em.find(UserEntity, {
      id: { $in: createdByIds },
    });
  }
}
