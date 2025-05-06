import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './pagination.dto';

// export class ProductFilterDto extends PaginationDto {
export class KeywordFilterDto {
  @ApiProperty({ required: false, example: 'Ipad Air 4' })
  @IsOptional()
  @IsString()
  productName?: string;

}
