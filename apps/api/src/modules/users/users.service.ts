import {
  AutoPath,
  EntityRepository,
  RequiredEntityData,
} from '@mikro-orm/core';
import { InjectEntityManager, InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { UserRole } from '~/const/enums';
import { RoleEntity, UserEntity } from '~/entities';

@Injectable()
export class UsersService {
  public defaultPopulate: AutoPath<UserEntity, any> = ['role', 'stores'];
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,

    @InjectRepository(RoleEntity)
    private readonly roleRepository: EntityRepository<RoleEntity>,
  ) {}

  async createUser(data: RequiredEntityData<UserEntity>): Promise<UserEntity> {
    const user = this.userRepository.create(data);
    await this.userRepository.insert(user);
    return user;
  }

  async findByEmail(email: string, populate?: string[]) {
    return this.userRepository.findOne(
      { email },
      { populate: populate ? populate : this.defaultPopulate },
    );
  }

  async findRole(role: UserRole) {
    return this.roleRepository.findOne({ role });
  }
}
