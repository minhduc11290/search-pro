import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  Property,
  types,
} from '@mikro-orm/core';
import { LocationStatus } from '~/share/consts/enums';
import { AttachmentEntity, GeoRefEntity, StoreEntity } from '.';
import { BaseEntity } from './BaseEntity';
import { StoreSearchableLocationEntity } from './StoreSearchableLocationEntity';
import { IsOptional } from 'class-validator';

@Entity({ tableName: 'location_searchables' })
export class LocationSearchableEntity extends BaseEntity<LocationSearchableEntity> {

  @ManyToOne(() => StoreEntity)
  store!: StoreEntity;

  @Property({ length: 100 })
  steName!: string;

  @Property({ nullable: true, type: types.json })
  cities?: string[];
}