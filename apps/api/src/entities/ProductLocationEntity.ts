import { Entity, ManyToOne, Property, types } from '@mikro-orm/core';
import { BaseEntity, LocationEntity, ProductEntity } from './index';

@Entity({ tableName: 'product_locations' })
export class ProductLocationEntity extends BaseEntity<ProductLocationEntity> {
  @Property({ type: types.float, nullable: false })
  price!: number;

  @ManyToOne(() => ProductEntity)
  product!: ProductEntity;

  @ManyToOne(() => LocationEntity)
  location!: LocationEntity;
}
