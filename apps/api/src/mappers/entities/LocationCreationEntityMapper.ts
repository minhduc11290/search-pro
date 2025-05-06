import { RequiredEntityData } from '@mikro-orm/core';
import { LocationEntity } from '~/entities';
import { LocationStatus } from '~/share/consts/enums';
import { LocationCreationDto } from '~/share/dtos/store-location-creation.dto';
import { CreateEntityMapper } from '../base/CreateEntityMapper';

interface LocationCreationOptions {
  createdBy: string;
  storeId: string;
}

export class LocationCreationEntityMapper extends CreateEntityMapper<
  LocationCreationDto,
  LocationEntity,
  LocationCreationOptions
> {
  map(
    source: LocationCreationDto,
    options: LocationCreationOptions,
  ): RequiredEntityData<LocationEntity> {
    return {
      name: source.name,
      address: source.address,
      openTime: source.openTime,
      closeTime: source.closeTime,
      geoRef: source.geoRefId,
      store: options.storeId,
      createdBy: options.createdBy,
      status: source.isActive ? LocationStatus.ACTIVE : LocationStatus.INACTIVE,
      phone: source.phone,
      addressLine1: source.addressLine1,
      addressLine2: source.addressLine2,
      city: source.city,
      isOpenMon: source.isOpenMon,
      openTimeMon: source.openTimeMon,
      closeTimeMon: source.closeTimeMon,

      isOpenTue: source.isOpenTue,
      openTimeTue: source.openTimeTue,
      closeTimeTue: source.closeTimeTue,

      isOpenWed: source.isOpenWed,
      openTimeWed: source.openTimeWed,
      closeTimeWed: source.closeTimeWed,

      isOpenThu: source.isOpenThu,
      openTimeThu: source.openTimeThu,
      closeTimeThu: source.closeTimeThu,

      isOpenFri: source.isOpenFri,
      openTimeFri: source.openTimeFri,
      closeTimeFri: source.closeTimeFri,

      isOpenSat: source.isOpenSat,
      openTimeSat: source.openTimeSat,
      closeTimeSat: source.closeTimeSat,


      isOpenSun: source.isOpenSun,
      openTimeSun: source.openTimeSun,
      closeTimeSun: source.closeTimeSun,

      latitude: source.latitude,
      longitude: source.longitude

      
    };
  }
}
