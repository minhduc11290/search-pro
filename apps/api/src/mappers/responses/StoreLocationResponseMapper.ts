import { LocationEntity } from '~/entities';
import { StoreLocationResponseDto } from '~/share/dtos';
import { BaseMapper } from '../base/BaseMapper';
import { LocationStatus } from '~/share/consts/enums';

export class StoreLocationResponseMapper extends BaseMapper<
  LocationEntity,
  StoreLocationResponseDto
> {
  map(source: LocationEntity): StoreLocationResponseDto {
    const storeLocationDto: StoreLocationResponseDto = {
      id: source.id,
      address: source.address,
      openTime: source.openTime ?? '',
      closeTime: source.closeTime ?? '',
      status: source.status ?? LocationStatus.INACTIVE,
      geoRef: {
        id: source.geoRef.id,
        zipCode: source.geoRef.zipCode,
        steName: source.geoRef.steName,
      },
      store: {
        id: source.store.id,
        name: source.store.name,
      },
      phone: source.phone,
      attachments: source.attachments.length > 0 ? source.attachments?.map((attachment) => (
        {
          id: attachment.id,
          name: attachment.name,
          type: attachment.type,
          url: attachment.url,
        })) : [],

    };
    return storeLocationDto;
  }
}
