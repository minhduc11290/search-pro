import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { AttachmentDto } from './product-creation.dto';
import { Type } from 'class-transformer';

export class LocationCreationDto {
  @ApiProperty({ example: 'Location Name' })
  @IsString()
  name!: string;

  @ApiProperty({ example: '123 Hong Bang street' })
  @IsString()
  address!: string;

  @ApiProperty({ example: '10:30AM' })
  @IsString()
  openTime!: string;

  @ApiProperty({ example: '10:30PM' })
  @IsString()
  closeTime!: string;

  @ApiProperty({ example: '9da8b809-efdf-43ff-8ff5-03b364021fb6' })
  @IsString()
  geoRefId!: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  isActive!: boolean;

  @ApiProperty({ example: '9da8b809-efdf-43ff-8ff5-03b364021fb6' })
  @IsOptional()
  @IsString()
  phone?: string;


  @ApiProperty({ required: true, type: [AttachmentDto] })
  @IsArray()
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

}
