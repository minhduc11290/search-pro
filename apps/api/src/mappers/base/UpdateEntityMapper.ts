import { EntityData, Loaded } from '@mikro-orm/core';
import { BaseEntity } from '~/entities/BaseEntity';
import { BaseMapper } from './BaseMapper';

export interface IEntityMapperOptions {
  full?: boolean;
  [key: string]: any;
}

export abstract class UpdateEntityMapper<
  Source,
  Entity extends BaseEntity<Entity>,
  Options extends IEntityMapperOptions = {
    full?: boolean;
  },
> extends BaseMapper<Source, EntityData<Loaded<Entity, never>>, Options> {}
