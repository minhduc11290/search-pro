import { EntityData, Loaded } from '@mikro-orm/core';
import { BaseEntity } from '~/entities/BaseEntity';
import { Mapper } from './Mapper';

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
> extends Mapper<Source, EntityData<Loaded<Entity, never>>, Options> {}
