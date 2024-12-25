import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '../consts/enums';
import { IsNumber, IsString } from 'class-validator';

export class MinLocationDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({ required: true, example: '12345' })
  zipCode!: string;

  @ApiProperty({ required: true, example: 'New Jersey' })
  steName!: string;

  @ApiProperty({ required: true, example: '12345' })
  price!: number;

  @ApiProperty({ required: true, example: '12345' })
  address?: string;

  @ApiProperty({ required: true, example: '12345' })
  openTime?: string;

  @ApiProperty({ required: true, example: '12345' })
  closeTime?: string;
}

export class LocationPriceDto {

  @ApiProperty({ example: '9da8b809-efdf-43ff-8ff5-03b364021fb6' })
  @IsString()
  id!: string;


  @ApiProperty({ example: '9da8b809-efdf-43ff-8ff5-03b364021fb6' })
  @IsNumber()
  price!: number;
}

export class MinStoreDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({ required: true, example: 'Store Name' })
  name!: string;

  @ApiProperty({ required: true, example: '123-123' })
  phone?: string;
}

export class MinAttachmentDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({ required: true, example: 'Store Name' })
  name!: string;

  @ApiProperty({ required: true, example: 'image/png' })
  type!: string;

  @ApiProperty({ required: true, example: 'https://example.com/image.png' })
  url!: string;
}

export class ProductLocationResponseDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  productId!: string;

  @ApiProperty({ required: true, example: 'SKU123' })
  sku?: string;

  @ApiProperty({ required: false, example: 'Product Name' })
  name?: string;

  @ApiProperty({ required: false, type: 'array', items: { type: 'string' } })
  keywords?: string[];

  @ApiProperty({ example: 'Product description' })
  description?: string;

  @ApiProperty({ required: true, type: MinStoreDto })
  store!: MinStoreDto;

  @ApiProperty({ required: true, type: MinLocationDto })
  location!: MinLocationDto;

  @ApiProperty({ required: false, type: [MinAttachmentDto] })
  attachments?: MinAttachmentDto[];

  @ApiProperty({ required: true, example: 'ACTIVE' })
  status!: ProductStatus;

  @ApiProperty({ required: true, example: 'ACTIVE' })
  banner?: string;
}
