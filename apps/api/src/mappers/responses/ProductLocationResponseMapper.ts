import { ProductLocationEntity } from '~/entities';
import { ProductLocationResponseDto } from '~/share/dtos/product-location-response.dto';
import { BaseMapper } from '../base/BaseMapper';
import { ProductStatus } from '~/share/consts/enums';

export class ProductLocationResponseMapper extends BaseMapper<
  ProductLocationEntity,
  ProductLocationResponseDto
> {
  map(source: ProductLocationEntity): ProductLocationResponseDto {

    const d = new Date();
    let day = d.getDay();
    let isOpen = false;
    let openTime = "";
    let closeTime = "";
    switch (day) {
      case 0:
        // code block
        isOpen = source.location.isOpenSun ?? false;
        openTime = source.location.openTimeSun ?? '';
        closeTime = source.location.closeTimeSun ?? '';
        break;
      case 1:
        isOpen = source.location.isOpenMon ?? false;
        openTime = source.location.openTimeMon ?? '';
        closeTime = source.location.closeTimeMon ?? '';
        // code block
        break;
      case 2:
        isOpen = source.location.isOpenTue ?? false;
        openTime = source.location.openTimeTue ?? '';
        closeTime = source.location.closeTimeTue ?? '';
        // code block
        break;
      case 3:
        isOpen = source.location.isOpenWed ?? false;
        openTime = source.location.openTimeWed ?? '';
        closeTime = source.location.closeTimeWed ?? '';

        // code block
        break;
      case 4:
        isOpen = source.location.isOpenThu ?? false;
        openTime = source.location.openTimeThu ?? '';
        closeTime = source.location.closeTimeThu ?? '';

        // code block
        break;
      case 5:
        isOpen = source.location.isOpenFri ?? false;
        openTime = source.location.openTimeFri ?? '';
        closeTime = source.location.closeTimeFri ?? '';

        // code block
        break;
      case 6:
        isOpen = source.location.isOpenSat ?? false;
        openTime = source.location.openTimeSat ?? '';
        closeTime = source.location.closeTimeSat ?? '';

        // code block
        break;
      default:
      // code block
    }

    const productLocationDto: ProductLocationResponseDto = {
      id: source.id,
      productId: source.product.id,
      sku: source.product.sku ?? '',
      name: source.product.name,
      keywords: source.product.keywords,
      description: source.product.description,
      status: source.product.status ?? ProductStatus.INACTIVE,
      store: {
        id: source.location.store.id,
        name: source.location.store.name,
        phone: source.location.phone ?? source.location.store.primaryPhone,
        website: source.location.store.website,
      },

      location: {
        id: source.location.id,
        zipCode: source.location.geoRef.zipCode,
        steName: source.location.geoRef.steName,
        price: source.price,
        // openTime: source.location.openTime,
        // closeTime: source.location.closeTime,
        openTime: isOpen ? openTime : '00:00',
        closeTime: isOpen ? closeTime : '00:00',
        isOpen: isOpen,
        // address: source.location.address
        address: (source.location.addressLine1 ?? '') + ' ' + (source.location.addressLine2 ?? '') + ' ' + (source.location.city ?? '') + ', ' + (source.location.geoRef.steName ?? '') + ' ' + (source.location.geoRef.zipCode ?? '')
      },
      //FIXME: This is a temporary solution, we should use a service to get the file
      attachments: source.product.attachments.map((attachment) => {
        return {
          id: attachment.id,
          name: attachment.name,
          type: attachment.type,
          url: attachment.url,
        }
      }),
      banner: source.location.attachments.length > 0 ? source.location.attachments[0].name : undefined
      // [
      //   {
      //     id: '1',
      //     name: 'attachment1',
      //     type: 'image',
      //     url: '/files/iphone1.jpg',
      //   },
      //   {
      //     id: '2',
      //     name: 'attachment2',
      //     type: 'image',
      //     url: '/files/iphone2.png',
      //   },
      //   {
      //     id: '2',
      //     name: 'attachment2',
      //     type: 'image',
      //     url: '/files/iphone3.png',
      //   },
      // ],
      // attachments: source.product.attachments?.map((attachment) => ({
      //   id: attachment.id,
      //   name: attachment.name,
      //   type: attachment.type,
      //   url: attachment.url,
      // })),
    };
    return productLocationDto;
  }
}
