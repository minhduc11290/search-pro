import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { LocationStatus } from '~/consts/enums';
import { CountryEntity, StoreEntity } from '.';
import { BaseEntity } from './BaseEntity';

@Entity({ tableName: 'locations' })
export class LocationEntity extends BaseEntity<LocationEntity> {
  @Property({ length: 255 })
  name!: string;

  @Property({ length: 1000 })
  address!: string;

  @Property({ length: 100, nullable: true })
  city?: string;

  @Property({ length: 100, nullable: true })
  state?: string;

  @ManyToOne(() => CountryEntity, { nullable: true })
  country?: CountryEntity;

  @Property({ length: 25, nullable: true })
  zipCode?: string;

  @Property({ length: 100, nullable: true })
  openTime?: string;

  @Property({ length: 100, nullable: true })
  closeTime?: string;

  @Enum({ items: () => LocationStatus })
  status?: LocationStatus = LocationStatus.ACTIVE;

  @ManyToOne(() => StoreEntity)
  store!: StoreEntity;
}
