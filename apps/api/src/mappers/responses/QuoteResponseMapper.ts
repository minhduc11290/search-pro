import { QuoteEntity } from '~/entities';
import { QuoteResponseDto } from '~/share/dtos';
import { BaseMapper } from '../base/BaseMapper';

export class QuoteResponseMapper extends BaseMapper<
  QuoteEntity,
  QuoteResponseDto
> {
  map(source: QuoteEntity): QuoteResponseDto {
    const quoteDto: QuoteResponseDto = {
      id: source.id,
      status: source.status,

      product: {
        id: source.productLocation.product.id,
        sku: source.productLocation.product.sku,
        name: source.productLocation.product.name,
        price: source.productLocation.price,
        attachments: source.productLocation?.product?.attachments?.map((attachment) => {
          return {
            id: attachment.id,
            name: attachment.name,
            type: attachment.type,
            url: attachment.url,
          }
        }),
        description: source.productLocation.product.description,
        banner: (source.productLocation.location?.attachments ?? []).length > 0 ? source.productLocation.location.attachments[0].name : undefined
      },
      store: {
        id: source.store.id,
        name: source.store.name,
        phone: source.store.primaryPhone ?? '',
      },
      location: {
        id: source.productLocation.location.id,
        price: source.productLocation.price,
        name: source.productLocation.location.name,
        address: source.productLocation.location.address,
        openTime: source.productLocation.location.openTime ?? 'N/A',
        closeTime: source.productLocation.location.closeTime ?? 'N/A',
      },
      contact: {
        name: source?.contact?.name,
        email: source?.contact?.email,
        phone: source?.contact?.phone,
        note: source?.contact?.note
      },

      // comments: [
      //   {
      //     id: source.productLocation.id,
      //     outOfStock: true,
      //     price: 10,
      //     quantity: 2,
      //     content: 'Contact store for more information',
      //   },
      // ],
      //TODO: fix this
      comments: source.comments.map((comment) => ({
        id: comment.id,
        outOfStock: comment.outOfStock ?? false,
        price: comment.price ?? 10,
        quantity: comment.quantity ?? 2,
        content: comment.content,
      })),
    };
    return quoteDto;
  }
}
