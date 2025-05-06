import { LocationEntity } from '~/entities';
import { StoreLocationResponseDto } from '~/share/dtos';
import { BaseMapper } from '../base/BaseMapper';
import { LocationStatus } from '~/share/consts/enums';

export class StoreLocationResponseMapper extends BaseMapper<
  LocationEntity,
  StoreLocationResponseDto
> {
  map(source: LocationEntity): StoreLocationResponseDto {
    const d = new Date();
    let day = d.getDay();
    let isOpen = false;
    let openTime = "";
    let closeTime = "";
    switch (day) {
      case 0:
        // code block
        isOpen = source.isOpenSun ?? false;
        openTime = source.openTimeSun ?? '';
        closeTime = source.closeTimeSun ?? '';
        break;
      case 1:
        isOpen = source.isOpenMon ?? false;
        openTime = source.openTimeMon ?? '';
        closeTime = source.closeTimeMon ?? '';
        // code block
        break;
      case 2:
        isOpen = source.isOpenTue ?? false;
        openTime = source.openTimeTue ?? '';
        closeTime = source.closeTimeTue ?? '';
        // code block
        break;
      case 3:
        isOpen = source.isOpenWed ?? false;
        openTime = source.openTimeWed ?? '';
        closeTime = source.closeTimeWed ?? '';

        // code block
        break;
      case 4:
        isOpen = source.isOpenThu ?? false;
        openTime = source.openTimeThu ?? '';
        closeTime = source.closeTimeThu ?? '';

        // code block
        break;
      case 5:
        isOpen = source.isOpenFri ?? false;
        openTime = source.openTimeFri ?? '';
        closeTime = source.closeTimeFri ?? '';

        // code block
        break;
      case 6:
        isOpen = source.isOpenSat ?? false;
        openTime = source.openTimeSat ?? '';
        closeTime = source.closeTimeSat ?? '';

        // code block
        break;
      default:
      // code block
    }

    const storeLocationDto: StoreLocationResponseDto = {
      id: source.id,
      address: source.address,
      isOpen: isOpen,
      openTime: isOpen ? openTime : '00:00',
      closeTime: isOpen ? closeTime : '00:00',
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
      addressLine1: source.addressLine1,
      addressLine2: source.addressLine2,
      city: source.city,
      fax: source.fax,

      isOpenMon: source.isOpenMon ?? false,
      openTimeMon: source.openTimeMon ?? '',
      closeTimeMon: source.closeTimeMon ?? '',

      isOpenTue: source.isOpenTue ?? false,
      openTimeTue: source.openTimeTue ?? '',
      closeTimeTue: source.closeTimeTue ?? '',


      isOpenWed: source.isOpenWed ?? false,
      openTimeWed: source.openTimeWed ?? '',
      closeTimeWed: source.closeTimeWed ?? '',

      isOpenThu: source.isOpenThu ?? false,
      openTimeThu: source.openTimeThu ?? '',
      closeTimeThu: source.closeTimeThu ?? '',

      isOpenFri: source.isOpenFri ?? false,
      openTimeFri: source.openTimeFri ?? '',
      closeTimeFri: source.closeTimeFri ?? '',

      isOpenSat: source.isOpenSat ?? false,
      openTimeSat: source.openTimeSat ?? '',
      closeTimeSat: source.closeTimeSat ?? '',

      isOpenSun: source.isOpenSun ?? false,
      openTimeSun: source.openTimeSun ?? '',
      closeTimeSun: source.closeTimeSun ?? '',

      latitude: source.latitude ?? 0,
      longitude: source.longitude ?? 0,
      cities: source.cities ?? []
    };
    return storeLocationDto;
  }
}
