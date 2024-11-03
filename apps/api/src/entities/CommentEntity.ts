import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { QuoteEntity, UserEntity } from '.';
import { BaseEntity } from './BaseEntity';

@Entity({ tableName: 'comments' })
export class CommentEntity extends BaseEntity<CommentEntity> {
  @ManyToOne(() => QuoteEntity)
  quote!: QuoteEntity;

  @ManyToOne(() => UserEntity)
  sender!: UserEntity;

  @Property({ length: 1000 })
  content!: string;
}
