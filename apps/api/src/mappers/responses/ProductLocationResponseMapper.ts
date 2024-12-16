import { ProductLocationEntity } from '~/entities';
import { ProductLocationResponseDto } from '~/share/dtos/product-location-response.dto';
import { BaseMapper } from '../base/BaseMapper';
import { ProductStatus } from '~/share/consts/enums';

export class ProductLocationResponseMapper extends BaseMapper<
  ProductLocationEntity,
  ProductLocationResponseDto
> {
  map(source: ProductLocationEntity): ProductLocationResponseDto {
    const productLocationDto: ProductLocationResponseDto = {
      id: source.id,
      productId: source.product.id,
      sku: source.product.sku,
      name: source.product.name,
      keywords: source.product.keywords,
      description: source.product.description,
      status: source.product.status ?? ProductStatus.INACTIVE,
      store: {
        id: source.location.store.id,
        name: source.location.store.name,
        phone: source.location.store.primaryPhone,
      },
      location: {
        id: source.location.id,
        zipCode: source.location.geoRef.zipCode,
        steName: source.location.geoRef.steName,
        price: source.price,
        openTime: source.location.openTime,
        closeTime: source.location.closeTime,
        address: source.location.address
      },
      //FIXME: This is a temporary solution, we should use a service to get the file
      attachments: source.product.attachments.map((attachment) => {
        return {
          id: attachment.id,
          name: attachment.name,
          type: attachment.type,
          url: attachment.url,
        }
      })
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
