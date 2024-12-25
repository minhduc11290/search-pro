import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  Property,
  types,
} from '@mikro-orm/core';
import { QuoteStatus } from '~/share/consts/enums';
import {
  CommentEntity,
  ContactEntity,
  ProductLocationEntity,
  StoreEntity,
  UserEntity,
} from '.';
import { BaseEntity } from './BaseEntity';

@Entity({ tableName: 'quotes' })
export class QuoteEntity extends BaseEntity<QuoteEntity> {
  // @ManyToOne(() => ProductLocationEntity)
  @Property({ type: types.uuid })
  productLocation!: string;

  @Property({ type: types.uuid })
  product!: string;

  @Property({ type: types.uuid })
  geoRef!: string;

  @Property()
  banner?: string;

  @Property()
  image?: string;

  @ManyToOne(() => StoreEntity)
  store!: StoreEntity;

  @ManyToOne(() => UserEntity)
  requestor!: UserEntity;

  @ManyToOne(() => ContactEntity)
  contact!: ContactEntity;

  @OneToMany(() => CommentEntity, 'quote')
  comments = new Collection<CommentEntity>(this);

  @Enum({ items: () => QuoteStatus, nullable: false })
  status?: QuoteStatus = QuoteStatus.WAITING;

  @Property({ type: types.float, nullable: true })
  price?: number;

  @Property({ length: 100, nullable: true })
  // @Unique()
  sku?: string;

  @Property({ length: 255, nullable: true })
  name?: string;


  @Property({ length: 1000, nullable: true })
  description?: string;

  @Property({ type: types.uuid })
  locationId!: string;

  @Property({ length: 255 })
  locationName?: string;

  @Property({ length: 1000 })
  address?: string;

  @Property({ length: 100, nullable: true })
  openTime?: string;

  @Property({ length: 100, nullable: true })
  closeTime?: string;
}
