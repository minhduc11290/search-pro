import { Entity, Property } from '@mikro-orm/core';
import { IsUrl } from 'class-validator';
import { BaseEntity } from './BaseEntity';

@Entity({ tableName: 'attachments' })
export class AttachmentEntity extends BaseEntity<AttachmentEntity> {
  @Property({ length: 255, nullable: false })
  name!: string;

  @Property({ length: 255, nullable: false })
  type!: string;

  @Property({ length: 255, nullable: true })
  description?: string;

  @Property({ length: 255, nullable: false })
  @IsUrl()
  url!: string;
}
