import { Entity, Property, types } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';

@Entity({ tableName: 'countries' })
export class CountryEntity extends BaseEntity<CountryEntity> {
  @Property({ length: 255 })
  country!: string;

  @Property({ type: types.integer, nullable: true })
  rang?: number;

  @Property({ type: types.smallint, nullable: true })
  order?: number;

  @Property({ type: types.json })
  phoneCode!: string[];

  @Property({ length: 2 })
  isoCode!: string;

  @Property({ length: 255, nullable: true })
  population?: string;

  @Property({ length: 255, nullable: true })
  areaKm2?: string;

  @Property({ length: 255, nullable: true })
  gdpUsd?: string;
}
