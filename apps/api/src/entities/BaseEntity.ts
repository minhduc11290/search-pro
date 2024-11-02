import {
  Opt,
  BaseEntity as ORMBaseEntity,
  PrimaryKey,
  Property,
  types,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseEntity<
  T extends BaseEntity<T>,
> extends ORMBaseEntity {
  @PrimaryKey({ type: types.uuid })
  id: string = uuidv4();

  @Property({ type: types.uuid, nullable: false })
  createdBy!: string;

  @Property({ type: types.uuid, nullable: false })
  updatedBy!: string;

  @Property()
  createdAt: Date & Opt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date();
}
