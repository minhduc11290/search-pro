import type { EntityManager } from '@mikro-orm/core';
import { UserRole } from 'src/const/enums';
import { RoleEntity } from 'src/entities';
import roleData from '../resources/roles.json';
import { BaseSeeder } from './BaseSeeder';

export class RoleSeeder extends BaseSeeder {
  async run(em: EntityManager): Promise<void> {
    const roleEntities: RoleEntity[] = [];
    for (const index in roleData) {
      const item = roleData[Number(index)];
      const role = em.create(RoleEntity, {
        ...item,
        role: item.role as UserRole,
      });
      roleEntities.push(role);
    }
    await em.persistAndFlush(roleEntities);
  }
}
