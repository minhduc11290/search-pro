import {
  ManyToOne,
  Entity,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { LocationEntity } from '.';

@Entity({ tableName: 'store_location_searchable' })
export class StoreSearchableLocationEntity extends BaseEntity<StoreSearchableLocationEntity> {
  @ManyToOne(() => LocationEntity, { nullable: true })
  location?: LocationEntity;

  @Property({ length: 100 })
  zipCode!: string;
}
