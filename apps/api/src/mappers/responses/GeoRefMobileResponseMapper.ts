import { GeoRefEntity } from '~/entities';
import { GeoRefMobileResponseDto } from '~/share/dtos';
import { BaseMapper } from '../base/BaseMapper';

export class GeoRefMobileResponseMapper extends BaseMapper<
  GeoRefEntity,
  GeoRefMobileResponseDto
> {
  map(source: GeoRefEntity): GeoRefMobileResponseDto {
    const geoRefResponseDto = {
      zipCode: source.zipCode,
      steName: source.steName,
    };
    return geoRefResponseDto;
  }
}

