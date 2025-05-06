import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
  types,
} from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'categories' })
export class CategoryEntity {
  @Property({ length: 255 })
  name!: string;

  @PrimaryKey({ type: types.uuid })
  id: string = uuidv4();

  @Property({ length: 255, nullable: true })
  url?: string;

  @Property({ length: 255, nullable: true })
  productUrl?: string;
}
