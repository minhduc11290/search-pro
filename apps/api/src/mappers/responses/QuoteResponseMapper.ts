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
        // id: source.productLocation.product.id,
        sku: source.sku ?? "",
        name: source.name,
        price: source.price,
        attachments: [{
          id: "",
          name: source.image ?? "",
          url: source.image ?? "",
          type: "",
        }],
        // attachments: source.productLocation?.product?.attachments?.map((attachment) => {
        //   return {
        //     id: attachment.id,
        //     name: attachment.name,
        //     type: attachment.type,
        //     url: attachment.url,
        //   }
        // }),
        description: source.description,
        // banner: (source.productLocation.location?.attachments ?? []).length > 0 ? source.productLocation.location.attachments[0].name : undefined
        banner: (source.banner ?? ""),
        id: source.locationId
      },
      store: {
        id: source.store.id,
        name: source.store.name,
        phone: source.store.primaryPhone ?? '',
      },
      location: {
        id: source.locationId,
        price: source.price ?? 0,
        name: source.locationName ?? "",
        address: source.address ?? "",
        openTime: source.openTime ?? 'N/A',
        closeTime: source.closeTime ?? 'N/A',
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
