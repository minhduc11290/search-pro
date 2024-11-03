import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  types,
  Unique,
} from '@mikro-orm/core';
import { LocationEntity, ProductEntity } from './index';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'product_locations' })
@Unique({ properties: ['product', 'location'] })
export class ProductLocationEntity {
  @PrimaryKey({ type: types.uuid })
  id: string = uuidv4();

  @Property({ type: types.float, nullable: false })
  price!: number;

  @ManyToOne(() => ProductEntity)
  product!: ProductEntity;

  @ManyToOne(() => LocationEntity)
  location!: LocationEntity;
}
