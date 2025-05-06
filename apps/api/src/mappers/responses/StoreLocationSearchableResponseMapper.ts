import { LocationSearchableEntity } from '~/entities';
import { StoreLocationSearchableResponseDto } from '~/share/dtos';
import { BaseMapper } from '../base/BaseMapper';
import { LocationStatus } from '~/share/consts/enums';

export class StoreLocationSearchableResponseMapper extends BaseMapper<
  LocationSearchableEntity,
  StoreLocationSearchableResponseDto
> {
  map(source: LocationSearchableEntity): StoreLocationSearchableResponseDto {


    return {
      id: source.id,
      state: source.steName,
      cities: source.cities,
    };
  }
}
