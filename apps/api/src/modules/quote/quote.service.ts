import {
  AutoPath,
  EntityManager,
  FilterQuery,
  QueryOrder,
} from '@mikro-orm/core';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ContactEntity, ProductLocationEntity, QuoteEntity } from '~/entities';
import { QuoteStatus } from '~/share/consts/enums';
import { QuoteCreationDto } from '~/share/dtos';

@Injectable()
export class QuoteService {
  public defaultPopulate: AutoPath<QuoteEntity, any> = [
    'store',
    'requestor',
    'contact',
    'comments',
    // 'productLocation',
    // 'productLocation.location',
    // 'productLocation.product',
    // 'productLocation.product.attachments',
    // 'productLocation.location.attachments',
  ] as never[];
  constructor(private readonly em: EntityManager) { }

  private getPopulates(populate?: string[]) {
    if (populate) {
      return populate as never[];
    }
    return this.defaultPopulate as never[];
  }

  //FIXME: This method is not used anywhere in the codebase
  async createQuote(requesterId: string, data: QuoteCreationDto) {
    console.log("da chay source moi");
    const existingQuote = await this.em.findOne(QuoteEntity, {
      productLocation: data.productLocationId,
      requestor: requesterId,
      status: QuoteStatus.WAITING,
    });
    if (existingQuote) {
      throw new BadRequestException('Quote is already created');
    }

    const productLocation = await this.em.findOne(
      ProductLocationEntity,
      { id: data.productLocationId },
      { populate: ['location.store', 'location', 'product', 'product.attachments', 'location.attachments', "location.geoRef"] },
    );

    if (!productLocation) {
      throw new BadRequestException('Product location not found');
    }

    const contact = this.em.create(ContactEntity, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      note: data.note,
    });

    const quote = this.em.create(QuoteEntity, {
      productLocation: data.productLocationId,
      store: productLocation.location.store,
      requestor: requesterId,
      contact,
      product: productLocation.product.id,
      geoRef: productLocation.location.geoRef.id,
      locationId: productLocation.id,
      price: productLocation.price,
      sku: productLocation.product.sku,
      name: productLocation.product.name,
      description: productLocation.product.description,
      locationName: productLocation.location.address,
      address: productLocation.location.address,
      openTime: productLocation.location.openTime,
      closeTime: productLocation.location.closeTime,
      // image: (productLocation.location?.attachments ?? []).length > 0 ? productLocation.location.attachments[0].name : '',
      image: (productLocation.product?.attachments ?? []).length > 0 ? productLocation.product.attachments[0].name : '',
      banner: (productLocation.location?.attachments ?? []).length > 0 ? productLocation.location.attachments[0].name : '',
    });
    console.log("quote", quote);
    await this.em.persistAndFlush(quote);
    return quote;
  }

  async findById(
    id: string,
    requestorId: string,
    populate?: string[],
  ): Promise<QuoteEntity | null> {
    return this.em.findOne(
      QuoteEntity,
      { id, requestor: requestorId },
      {
        populate: this.getPopulates(populate),
      },
    );
  }

  async findByRequestor(
    requestorId: string,
    populate?: string[],
  ): Promise<QuoteEntity[]> {
    return this.em.find(
      QuoteEntity,
      { requestor: requestorId },
      {
        populate: this.getPopulates(populate),
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
  }

  async findByStatus(
    requestorId: string,
    status?: QuoteStatus,
    populate?: string[],
  ): Promise<QuoteEntity[]> {
    const conditions: FilterQuery<QuoteEntity> = { requestor: requestorId };
    if (status) {
      conditions.status = status;
    }
    return this.em.find(QuoteEntity, conditions, {
      populate: this.getPopulates(populate),
      orderBy: { createdAt: QueryOrder.DESC },
    });
  }
}
