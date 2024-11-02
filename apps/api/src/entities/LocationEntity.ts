import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { LocationStatus } from 'src/const/enums';
import { BaseEntity, CountryEntity, StoreEntity } from './index';

@Entity({ tableName: 'locations' })
export class LocationEntity extends BaseEntity<LocationEntity> {
  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Property({ length: 1000 })
  address!: string;

  @Property({ length: 100, nullable: true })
  city?: string;

  @Property({ length: 100, nullable: true })
  state?: string;

  @OneToOne(() => CountryEntity, { nullable: true })
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
