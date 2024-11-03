import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';

@Entity({ tableName: 'contacts' })
export class ContactEntity extends BaseEntity<ContactEntity> {
  @Property({ length: 100 })
  name!: string;

  @Property({ length: 100 })
  email!: string;

  @Property({ length: 100 })
  phone!: string;

  @Property({ length: 1000 })
  note!: string;
}
