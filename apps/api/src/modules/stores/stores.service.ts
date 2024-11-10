import { EntityManager, RequiredEntityData } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { StoreEntity } from '~/entities';
import { StoreStatus } from '~/shares/consts/enums';
import { StoreUpdatingDto } from '~/shares/dtos';

@Injectable()
export class StoresService {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<StoreEntity[]> {
    return this.em.find(StoreEntity, {});
  }

  async create(
    storeData: RequiredEntityData<StoreEntity>,
  ): Promise<StoreEntity> {
    const store = this.em.create(StoreEntity, storeData);
    await this.em.persistAndFlush(store);
    return store;
  }

  async update(
    id: string,
    updateStoreDto: StoreUpdatingDto,
  ): Promise<StoreEntity> {
    const store = await this.em.findOneOrFail(StoreEntity, id);
    store.assign(updateStoreDto);
    await this.em.persistAndFlush(store);
    return store;
  }

  async softDelete(id: string): Promise<void> {
    const store = await this.em.findOneOrFail(StoreEntity, id);
    store.status = StoreStatus.INACTIVE;
    await this.em.persistAndFlush(store);
  }
}
