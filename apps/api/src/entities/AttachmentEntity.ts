import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  types,
} from '@mikro-orm/core';
import { IsUrl } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { ProductEntity } from './ProductEntity';
import { LocationEntity } from './LocationEntity';
import { StoreEntity } from './StoreEntity';

@Entity({ tableName: 'attachments' })
export class AttachmentEntity {
  @PrimaryKey({ type: types.uuid })
  id: string = uuidv4();

  @Property({ length: 255, nullable: false })
  name!: string;

  @Property({ length: 255, nullable: false })
  type!: string;

  @Property({ length: 255, nullable: true })
  description?: string;

  @Property({ length: 255, nullable: false })
  @IsUrl()
  url!: string;

  @ManyToOne(() => ProductEntity, { nullable: true })
  product?: ProductEntity;

  @ManyToOne(() => LocationEntity, { nullable: true })
  location?: LocationEntity;

  @ManyToOne(() => StoreEntity, { nullable: true })
  store?: StoreEntity;
}
