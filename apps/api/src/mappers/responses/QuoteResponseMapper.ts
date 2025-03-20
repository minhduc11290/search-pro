import { LocationEntity, QuoteEntity, StoreEntity } from '~/entities';
import { QuoteResponseDto } from '~/share/dtos';
import { BaseMapper } from '../base/BaseMapper';

export class QuoteResponseMapper extends BaseMapper<
  QuoteEntity,
  QuoteResponseDto,
  LocationEntity
> {
  map(source: QuoteEntity, store?: LocationEntity | null): QuoteResponseDto {

    const d = new Date();
    let day = d.getDay();
    let isOpen = false;
    let openTime = "";
    let closeTime = "";
    if (store) {
      switch (day) {
        case 0:
          // code block
          isOpen = store.isOpenSun ?? false;
          openTime = store.openTimeSun ?? '';
          closeTime = store.closeTimeSun ?? '';
          break;
        case 1:
          isOpen = store.isOpenMon ?? false;
          openTime = store.openTimeMon ?? '';
          closeTime = store.closeTimeMon ?? '';
          // code block
          break;
        case 2:
          isOpen = store.isOpenTue ?? false;
          openTime = store.openTimeTue ?? '';
          closeTime = store.closeTimeTue ?? '';
          // code block
          break;
        case 3:
          isOpen = store.isOpenWed ?? false;
          openTime = store.openTimeWed ?? '';
          closeTime = store.closeTimeWed ?? '';

          // code block
          break;
        case 4:
          isOpen = store.isOpenThu ?? false;
          openTime = store.openTimeThu ?? '';
          closeTime = store.closeTimeThu ?? '';

          // code block
          break;
        case 5:
          isOpen = store.isOpenFri ?? false;
          openTime = store.openTimeFri ?? '';
          closeTime = store.closeTimeFri ?? '';

          // code block
          break;
        case 6:
          isOpen = store.isOpenSat ?? false;
          openTime = store.openTimeSat ?? '';
          closeTime = store.closeTimeSat ?? '';

          // code block
          break;
        default:
        // code block
      }
    }
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
        // address: source.address ?? "",
        address: (store?.addressLine1 ?? '') + ' ' + (store?.addressLine2 ?? '') + ' ' + (store?.city ?? '') + ', ' + (store?.geoRef.steName ?? '') + ' ' + (store?.geoRef.zipCode ?? ''),
        openTime: isOpen ? openTime : '00:00', // source.openTime ?? 'N/A',
        closeTime: isOpen ? closeTime : '00:00', //source.closeTime ?? 'N/A',
        isOpen: isOpen
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
