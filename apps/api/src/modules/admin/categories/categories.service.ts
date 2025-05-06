import {
  AutoPath,
  EntityManager,
  FilterQuery,
  RequiredEntityData,
} from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { AttachmentEntity, CategoryEntity, LocationSearchableEntity } from '~/entities';
import { LocationStatus } from '~/share/consts/enums';
import { AttachmentDto } from '~/share/dtos/product-creation.dto';
import axios from 'axios';

@Injectable()
export class CategoriesService {
  public defaultPopulate: AutoPath<CategoryEntity, any> = [

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
      CategoryEntity,
      { id },
      { populate: this.getPopulates(populate) },
    );
  }

  async findAll(populate?: string[]): Promise<CategoryEntity[]> {
    return this.em.find(
      CategoryEntity,
      {},
      { populate: this.getPopulates(populate) },
    );
  }

  async findByCondition(
    condition: FilterQuery<CategoryEntity>,
    populate?: string[],
  ): Promise<CategoryEntity[]> {
    return this.em.find(CategoryEntity, condition, {
      populate: this.getPopulates(populate),
      orderBy: { id: 'ASC' }
    });
  }

  async create(
    locationData: RequiredEntityData<CategoryEntity>,
  ): Promise<CategoryEntity> {

    const location = this.em.create(CategoryEntity, locationData);
    await this.em.persistAndFlush(location);
    return location;
  }

  async update(
    id: string,
    updateLocationDto: Partial<CategoryEntity>,
  ): Promise<CategoryEntity> {
    // const location = await this.em.findOneOrFail(CategoryEntity, id);
    // location.assign(updateLocationDto);
    // await this.em.persistAndFlush(location);
    this.em.nativeUpdate(CategoryEntity, { id }, {
      name: updateLocationDto.name,
      url: updateLocationDto.url,
      productUrl: updateLocationDto.productUrl
    })
    const location = await this.em.findOneOrFail(CategoryEntity, id);

    return location;
  }

  async delete(id: string): Promise<void> {
    //const location = await this.em.findOneOrFail(LocationSearchableEntity, id);
    // location.status = LocationStatus.INACTIVE;
    await this.em.nativeDelete(CategoryEntity, { id });
  }


  // async deleteAttachment(
  //   id: string
  // ): Promise<void> {
  //   await this.em.nativeDelete(AttachmentEntity, {
  //     id
  //   });
  // }



}
