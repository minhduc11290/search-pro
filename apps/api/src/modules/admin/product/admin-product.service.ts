import { AutoPath, EntityManager, RequiredEntityData } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { AttachmentEntity, LocationEntity, ProductEntity, ProductLocationEntity } from '~/entities';
import { ProductStatus } from '~/share/consts/enums';
import { AttachmentDto, LocationDto } from '~/share/dtos/product-creation.dto';
import { LocationPriceDto } from '~/share/dtos/product-location-response.dto';
import { MinLocationDto } from '~/share/dtos/product-response.dto';

@Injectable()
export class AdminProductService {
  public defaultPopulate: AutoPath<ProductLocationEntity, any> = [
    'product',
    'product.attachments',
    'location',
    'location.store',
  ] as never[];

  public defaultPopulateProduct: AutoPath<ProductEntity, any> = [
    'store',
    'productLocations',
    'attachments',
    'productLocations.location',
    'productLocations.location.geoRef',

  ] as never[];
  constructor(private readonly em: EntityManager) { }

  private getPopulates(populate?: string[]) {
    if (populate) {
      return populate as never[];
    }
    return this.defaultPopulate as never[];
  }

  async findByProductAndLocation(
    productId: string,
    locationId: string,
    populate?: string[],
  ) {
    return await this.em.findOne(
      ProductLocationEntity,
      { product: productId, location: locationId },
      { populate: this.getPopulates(populate) },
    );
  }

  async findByLocation(
    locationId: string,
    populate?: string[],
  ): Promise<ProductLocationEntity[]> {
    return this.em.find(
      ProductLocationEntity,
      { location: locationId },
      { populate: this.getPopulates(populate) },
    );
  }

  async findProductById(id: string): Promise<ProductEntity> {
    return this.em.findOneOrFail(ProductEntity, id, {
      populate: this.defaultPopulateProduct as never[],
    });
  }

  async findByStore(
    storeId: string,
    populate?: string[],
  ): Promise<ProductLocationEntity[]> {
    return this.em.find(
      ProductLocationEntity,
      { location: { store: storeId } },
      { populate: this.getPopulates(populate) },
    );
  }

  async findProductByStore(
    storeId: string,
    populate?: string[],
  ): Promise<ProductEntity[]> {
    return this.em.find(
      ProductEntity,
      { store: storeId },
      {
        populate: this.defaultPopulateProduct as never[],
        orderBy: { createdAt: 'DESC' }
      },
    );
  }

  async create(
    productData: RequiredEntityData<ProductEntity>,
    productLocationData: LocationDto[],
    attachments: AttachmentDto[],
  ): Promise<ProductEntity> {
    const product = this.em.create(ProductEntity, productData);
    const productLocations = productLocationData.map((location) =>
      this.em.create(ProductLocationEntity, {
        location: location.locationId,
        product: product,
        price: location.price,
      }),
    );

    const productAttachments = attachments.map((attachment) =>
      this.em.create(AttachmentEntity, {
        name: attachment.name,
        type: '',
        url: attachment.url,
        product: product,
      }),
    );
    await this.em.persistAndFlush(productLocations);
    await this.em.persistAndFlush(productAttachments);
    return product;
  }

  async addProductLocation(productId: string, location: LocationPriceDto): Promise<void> {
    // let product = await this.findProductById(productId);
    let product = await this.findProductById(productId);

    let locations = this.em.create(ProductLocationEntity, {
      location: location.id,
      product: product,
      price: location.price,
    });
    await this.em.persistAndFlush(locations);

  }

  async updateProductLocation(id: string, locationDto: LocationPriceDto): Promise<void> {
    // let product = await this.findProductById(productId);

    let location = await this.em.findOneOrFail(LocationEntity, locationDto.id);
    if (location) {
      this.em.nativeUpdate(ProductLocationEntity, id, {
        location,
        price: locationDto.price,
      });
    }



  }
  async deleteProductLocation(
    productId: string,
    locationId: string,
  ): Promise<void> {
    await this.em.nativeDelete(ProductLocationEntity, {
      product: productId,
      location: locationId,
    });
  }

  async deleteLocation(
    id: string
  ): Promise<void> {
    await this.em.nativeDelete(ProductLocationEntity, {
      id
    });
  }

  async deleteAttachment(
    id: string
  ): Promise<void> {
    await this.em.nativeDelete(AttachmentEntity, {
      id
    });
  }

  async addAttachment(productId: string, attachments: AttachmentDto[]): Promise<AttachmentEntity[]> {
    let product = await this.findProductById(productId);

    const productAttachments = attachments.map((attachment) =>
      this.em.create(AttachmentEntity, {
        name: attachment.name,
        type: '',
        url: attachment.url,
        product: product,
      }),

    );
    await this.em.persistAndFlush(productAttachments);
    return productAttachments;
  }

  async deleteProduct(
    productId: string
  ): Promise<void> {
    let product = await this.findProductById(productId);

    if (product.productLocations) {
      // product.productLocations.map(async (location) => {
      //   await this.em.nativeDelete(ProductLocationEntity, {
      //     product: productId,
      //     location: location.id,
      //   });
      // });

      for (const location of product.productLocations) {
        await this.em.nativeDelete(ProductLocationEntity, {
          id: location.id,
        });
      }

    }

    if (product.attachments) {
      for (const attachment of product.attachments) {
        await this.em.nativeDelete(AttachmentEntity, {
          id: attachment.id,
        });
      }
    }

    await this.em.nativeDelete(ProductEntity, {
      id: productId,
    });


  }

  async softDelete(id: string): Promise<void> {
    const product = await this.em.findOneOrFail(ProductEntity, id);
    product.status = ProductStatus.INACTIVE;
    await this.em.persistAndFlush(product);
  }

  async update(
    id: string,
    productData: Partial<ProductEntity>,
  ): Promise<ProductEntity> {
    // const product = this.em.nativeUpdate(ProductEntity, productData);

    // return product;
    const product = await this.em.findOneOrFail(ProductEntity, id);

    product.assign(productData);


    await this.em.persistAndFlush(product);

    return product;
  }

  async findByStoreSku(storeId: string, sku: string) {
    return this.em.findOne(ProductEntity, { store: { id: storeId }, sku });
  }
}
