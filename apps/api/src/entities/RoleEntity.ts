import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { UserRole } from 'src/const/enums';
import { BaseEntity } from './BaseEntity';
import { UserEntity } from '.';

@Entity({ tableName: 'roles' })
export class RoleEntity extends BaseEntity<RoleEntity> {
  @Enum({ items: () => UserRole, nullable: false })
  role: UserRole = UserRole.USER;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @Property({ length: 1000, nullable: true })
  description?: string;
}
