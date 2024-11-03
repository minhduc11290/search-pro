import type { EntityManager } from '@mikro-orm/core';
import * as argon from 'argon2';
import { UserStatus } from 'src/const/enums';
import { RoleEntity, UserEntity } from 'src/entities';
import usersData from '../resources/users.json';
import { BaseSeeder } from './BaseSeeder';

export class UserSeeder extends BaseSeeder {
  async run(em: EntityManager): Promise<void> {
    const userEntities: UserEntity[] = [];
    const roles = await em.find(RoleEntity, {});
    for (const index in usersData) {
      const role = roles.find((r) => r.role === usersData[Number(index)].role);
      const item = usersData[Number(index)];
      const hashPassword = await argon.hash(item.password);
      const status = em.create(UserEntity, {
        ...item,
        password: hashPassword,
        role: role,
        status: item.status as UserStatus,
      });
      userEntities.push(status);
    }
    await em.persistAndFlush(userEntities);
  }
}
