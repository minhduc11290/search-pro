import {
  AutoPath,
  EntityManager,
  FilterQuery,
  RequiredEntityData,
} from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { AttachmentEntity, LocationSearchableEntity } from '~/entities';
import { LocationStatus } from '~/share/consts/enums';
import { AttachmentDto } from '~/share/dtos/product-creation.dto';
import axios from 'axios';

@Injectable()
export class AdminLocationSearchableService {
  public defaultPopulate: AutoPath<LocationSearchableEntity, any> = [

  ] as never[];
  constructor(private readonly em: EntityManager) { }

  private getPopulates(populate?: string[]) {
    if (populate) {
      return populate as never[];
    }
    return this.defaultPopulate as never[];
  }

  async findById(id: string, populate?: string[]) {
    return await this.em.findOne(
      LocationSearchableEntity,
      { id },
      { populate: this.getPopulates(populate) },
    );
  }

  async findAll(populate?: string[]): Promise<LocationSearchableEntity[]> {
    return this.em.find(
      LocationSearchableEntity,
      {},
      { populate: this.getPopulates(populate) },
    );
  }

  async findByCondition(
    condition: FilterQuery<LocationSearchableEntity>,
    populate?: string[],
  ): Promise<LocationSearchableEntity[]> {
    return this.em.find(LocationSearchableEntity, condition, {
      populate: this.getPopulates(populate),
      orderBy: { createdAt: 'DESC' }
    });
  }

  async create(
    locationData: RequiredEntityData<LocationSearchableEntity>,
  ): Promise<LocationSearchableEntity> {

    const location = this.em.create(LocationSearchableEntity, locationData);
    await this.em.persistAndFlush(location);
    return location;
  }

  async update(
    id: string,
    updateLocationDto: Partial<LocationSearchableEntity>,
  ): Promise<LocationSearchableEntity> {
    const location = await this.em.findOneOrFail(LocationSearchableEntity, id);
    location.assign(updateLocationDto);
    await this.em.persistAndFlush(location);
    return location;
  }

  async delete(id: string): Promise<void> {
    //const location = await this.em.findOneOrFail(LocationSearchableEntity, id);
    // location.status = LocationStatus.INACTIVE;
    await this.em.nativeDelete(LocationSearchableEntity, { id });
  }


  // async deleteAttachment(
  //   id: string
  // ): Promise<void> {
  //   await this.em.nativeDelete(AttachmentEntity, {
  //     id
  //   });
  // }



}
