import { AutoPath, EntityManager, FilterQuery } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { ProductLocationEntity, LocationEntity, LocationSearchableEntity, CategoryEntity } from '~/entities';

@Injectable()
export class ProductService {
  public defaultPopulate: AutoPath<ProductLocationEntity, any> = [
    'product',
    'product.store',
    'product.attachments',
    'location',
    'location.attachments',
  ] as never[];
  constructor(private readonly em: EntityManager) { }

  private getPopulates(populate?: string[]) {
    if (populate) {
      return populate as never[];
    }
    return this.defaultPopulate as never[];
  }

  async findByProductLocationId(
    condition: FilterQuery<ProductLocationEntity>,
    populate?: string[],
  ): Promise<ProductLocationEntity | null> {
    return this.em.findOne(ProductLocationEntity, condition, {
      populate: this.getPopulates(populate),
    });
  }

  async findByProductIdAndLocationId(
    productId: string,
    locationId: string,
    populate?: string[],
  ): Promise<ProductLocationEntity | null> {
    return this.em.findOne(
      ProductLocationEntity,
      { product: productId, location: locationId },
      {
        populate: this.getPopulates(populate),
      },
    );
  }

  async findByCondition(
    condition: FilterQuery<ProductLocationEntity>,
    // options: { page: number; limit: number },
    populate?: string[],
  ): Promise<ProductLocationEntity[]> {
    // const { page, limit } = options;
    const [productLocations] = await this.em.findAndCount(
      ProductLocationEntity,
      condition,
      {
        // limit,
        // offset: (page - 1) * limit,
        populate: this.getPopulates(populate),
      },
    );
    return productLocations;
  }

  async findByConditionWithPagination(
    condition: FilterQuery<ProductLocationEntity>,
    options: { page: number; limit: number },
    populate?: string[],
  ): Promise<ProductLocationEntity[]> {
    const { page, limit } = options;
    const [productLocations] = await this.em.findAndCount(
      ProductLocationEntity,
      condition,
      {
        limit,
        offset: (page - 1) * limit,
        populate: this.getPopulates(populate),
      },
    );
    return productLocations;
  }

  milesToH3Ring(miles: number): number {
    const diameterMiles = 1.06; // Resolution 7
    return Math.ceil(miles / diameterMiles);
  }

  async getAllLocation() {
    return this.em.find(LocationEntity, { h3Index: { $ne: null } });
  }

  async getLocationSearchable(steName: string, city: string) {
    return this.em.find(LocationSearchableEntity, {
      steName: steName,
      cities: { $contains: [city] }
    });
  }

  async findAllCategory() {
    return await this.em.find(
      CategoryEntity,
      {}
    );
  }


}
