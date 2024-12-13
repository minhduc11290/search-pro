import { RequiredEntityData } from '@mikro-orm/core';
import { ProductEntity } from '~/entities';
import { ProductStatus } from '~/share/consts/enums';
import { ProductCreationDto, ProductUpdateDto } from '~/share/dtos/product-creation.dto';
import { UpdateEntityMapper } from '../base/UpdateEntityMapper';

interface ProductUpdateOptions {
  product: ProductEntity,
  updateBy: string;
}

export class ProductUpdateEntityMapper extends UpdateEntityMapper<
  ProductUpdateDto,
  ProductEntity,
  ProductUpdateOptions
> {
  map(
    source: ProductUpdateDto,

    options: ProductUpdateOptions,
  ): Partial<ProductEntity> {
    return {
      sku: source.sku ?? options.product.sku,
      name: source.name ?? options.product.name,
      keywords: source.keywords ?? options.product.keywords,
      description: source.description ?? options.product.description,
      updatedBy: options.updateBy,
      status: source.isActive ? ProductStatus.ACTIVE : ProductStatus.INACTIVE // ProductStatus.ACTIVE
    };
  }
}
