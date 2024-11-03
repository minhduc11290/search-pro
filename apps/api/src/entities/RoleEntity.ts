import { Entity, Enum, PrimaryKey, Property, types } from '@mikro-orm/core';
import { UserRole } from 'src/const/enums';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'roles' })
export class RoleEntity {
  @PrimaryKey({ type: types.uuid })
  id: string = uuidv4();

  @Enum({ items: () => UserRole, nullable: false })
  role: UserRole = UserRole.USER;

  @Property({ length: 1000, nullable: true })
  description?: string;
}
