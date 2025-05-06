import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './pagination.dto';

// export class ProductFilterDto extends PaginationDto {
export class ProductNewFilterDto {

  @ApiProperty({ required: false, example: 'Ipad Air 4' })
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiProperty({ required: true, example: '60540' })
  @IsString()
  typeProduct!: string;

  // @ApiProperty({ required: true, example: 'Illinois' })
  // @IsString()
  // steName!: string;

  @ApiProperty({ required: true, example: '60540' })
  @IsString()
  typeSearch!: string;

  @ApiProperty({ required: false, example: '60540' })
  @IsString()
  @IsOptional()
  distance?: string;

  @ApiProperty({ required: false, example: '60540' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ required: false, example: '60540' })
  @IsString()
  @IsOptional()
  state?: string;


  @ApiProperty({ required: true, example: '60540' })
  @IsNumber()
  lat?: number;

  @ApiProperty({ required: true, example: '60540' })
  @IsNumber()
  lng?: number;
}
