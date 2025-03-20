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

@Entity({ tableName: 'locations' })
export class LocationEntity extends BaseEntity<LocationEntity> {
  @Property({ length: 255 })
  name!: string;

  @Property({ length: 1000 })
  address!: string;

  @Property({ length: 1000, nullable: true })
  addressLine1?: string;

  @Property({ length: 1000, nullable: true })
  addressLine2?: string;

  @Property({ length: 1000, nullable: true })
  city?: string;


  @Property({ length: 100, nullable: true })
  openTime?: string;

  @Property({ length: 100, nullable: true })
  closeTime?: string;

  @Enum({ items: () => LocationStatus })
  status?: LocationStatus = LocationStatus.ACTIVE;

  @ManyToOne(() => GeoRefEntity)
  geoRef!: GeoRefEntity;

  @ManyToOne(() => StoreEntity)
  store!: StoreEntity;

  @OneToMany(() => AttachmentEntity, 'location')
  attachments = new Collection<AttachmentEntity>(this);

  @Property({ length: 100, nullable: true })
  phone?: string;

  @Property({ length: 100, nullable: true })
  fax?: string;

  @OneToMany(() => StoreSearchableLocationEntity, 'location')
  zipCodes = new Collection<StoreSearchableLocationEntity>(this);

  @Property({ nullable: true })
  isOpenMon?: boolean;

  @Property({ length: 100, nullable: true })
  openTimeMon?: string;

  @Property({ length: 100, nullable: true })
  closeTimeMon?: string;


  @Property({ nullable: true })
  isOpenTue?: boolean;

  @Property({ length: 100, nullable: true })
  openTimeTue?: string;

  @Property({ length: 100, nullable: true })
  closeTimeTue?: string;

  @Property({ nullable: true })
  isOpenWed?: boolean;

  @Property({ length: 100, nullable: true })
  openTimeWed?: string;

  @Property({ length: 100, nullable: true })
  closeTimeWed?: string;

  @Property({ nullable: true })
  isOpenThu?: boolean;

  @Property({ length: 100, nullable: true })
  openTimeThu?: string;

  @Property({ length: 100, nullable: true })
  closeTimeThu?: string;

  @Property({ nullable: true })
  isOpenFri?: boolean;

  @Property({ length: 100, nullable: true })
  openTimeFri?: string;

  @Property({ length: 100, nullable: true })
  closeTimeFri?: string;

  @Property({ nullable: true })
  isOpenSat?: boolean;

  @Property({ length: 100, nullable: true })
  openTimeSat?: string;

  @Property({ length: 100, nullable: true })
  closeTimeSat?: string;

  @Property({ nullable: true })
  isOpenSun?: boolean;

  @Property({ length: 100, nullable: true })
  openTimeSun?: string;

  @Property({ length: 100, nullable: true })
  closeTimeSun?: string;

  @Property({ type: types.float, nullable: true })
  latitude?: number;

  @Property({ type: types.float, nullable: true })
  longitude?: number;


  @Property({ length: 1000, nullable: true })
  h3Index?: string;


}
