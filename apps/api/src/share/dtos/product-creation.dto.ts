import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class LocationDto {
  @ApiProperty({ required: true, example: 1 })
  price!: number;

  @ApiProperty({ required: true, example: 10 })
  locationId!: string;
}

export class AttachmentDto {
  @ApiProperty({ required: true, example: "demo.png" })
  name!: string;

  @ApiProperty({ required: true, example: "demo.png" })
  url!: string;
}


export class ProductCreationDto {
  @ApiProperty({ required: true, example: 'SKU123' })
  @IsString()
  sku!: string;

  @ApiProperty({ required: true, example: 'Product Name' })
  @IsString()
  name!: string;

  @ApiProperty({ required: false, example: ['keyword1', 'keyword2'] })
  @IsOptional()
  keywords?: string[];

  @ApiProperty({ example: 'Product description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: true, type: [LocationDto] })
  @IsArray()
  @Type(() => LocationDto)
  productLocations!: LocationDto[]; //FIXME: update attachments here


  @ApiProperty({ required: true, type: [AttachmentDto] })
  @IsArray()
  @Type(() => AttachmentDto)
  attachments!: AttachmentDto[];

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  isActive!: boolean;

}


export class ProductUpdateDto {
  @ApiProperty({ required: true, example: 'SKU123' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ required: true, example: 'Product Name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, example: ['keyword1', 'keyword2'] })
  @IsOptional()
  keywords?: string[];

  @ApiProperty({ example: 'Product description' })
  @IsString()
  @IsOptional()
  description?: string;


  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  isActive!: boolean;

}
