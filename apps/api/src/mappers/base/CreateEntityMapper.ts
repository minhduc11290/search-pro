import { RequiredEntityData } from '@mikro-orm/core';
import { BaseEntity } from '~/entities/BaseEntity';
import { BaseMapper } from './BaseMapper';

export interface IEntityMapperOptions {
  full?: boolean;
  [key: string]: any;
}
export abstract class CreateEntityMapper<
  Source,
  Entity extends BaseEntity<Entity>,
  Options extends IEntityMapperOptions = {
    full?: boolean;
  },
> extends BaseMapper<Source, RequiredEntityData<Entity>, Options> {}
