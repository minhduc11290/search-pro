import { CategoryEntity, LocationSearchableEntity } from '~/entities';
import { StoreLocationSearchableResponseDto } from '~/share/dtos';
import { BaseMapper } from '../base/BaseMapper';
import { LocationStatus } from '~/share/consts/enums';
import { CategoryResponseDto } from '~/share/dtos/category-response.dto';

export class CategoryResponseMapper extends BaseMapper<
  CategoryEntity,
  CategoryResponseDto
> {
  map(source: CategoryEntity): CategoryResponseDto {


    return {
      id: source.id,
      name: source.name,
      url: source.url ?? '',
      productUrl: source.productUrl ?? ''
    };
  }
}
