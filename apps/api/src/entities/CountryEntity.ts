import { Entity, PrimaryKey, Property, types } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'countries' })
export class CountryEntity {
  @PrimaryKey({ type: types.uuid })
  id: string = uuidv4();

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
