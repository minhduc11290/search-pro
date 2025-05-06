import { ApiProperty } from '@nestjs/swagger';
import { LocationStatus } from '../consts/enums';
import { MinAttachmentDto } from './product-location-response.dto';

export class MinStoreDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({ required: true, example: 'Store Name' })
  name!: string;
}

export class MinGeoRefDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({ required: true, example: '12345' })
  zipCode!: string;

  @ApiProperty({ required: true, example: 'New Jersey' })
  steName!: string;
}

export class StoreLocationResponseDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  @ApiProperty({ required: true, example: '123 Hong Bang street' })
  address!: string;

  @ApiProperty({ example: '10:30AM' })
  openTime?: string;

  @ApiProperty({ example: '10:30PM' })
  closeTime?: string;

  @ApiProperty({ example: true })
  isOpen?: boolean;

  @ApiProperty({ required: true, type: MinGeoRefDto })
  geoRef!: MinGeoRefDto;

  @ApiProperty({ required: true, type: MinStoreDto })
  store!: MinStoreDto;

  @ApiProperty({ required: true, example: 'ACTIVE' })
  status!: LocationStatus;

  @ApiProperty({ example: 'phone' })
  phone?: string;

  @ApiProperty({ required: false, type: [MinAttachmentDto] })
  attachments?: MinAttachmentDto[];



  @ApiProperty({ required: true })
  isOpenMon!: boolean;


  @ApiProperty({ example: '10:30AM' })
  openTimeMon!: string;

  @ApiProperty({ example: '10:30PM' })
  closeTimeMon!: string;


  @ApiProperty({ required: true })
  isOpenTue!: boolean;


  @ApiProperty({ example: '10:30AM' })
  openTimeTue!: string;

  @ApiProperty({ example: '10:30PM' })
  closeTimeTue!: string;


  @ApiProperty({ required: true })
  isOpenWed!: boolean;


  @ApiProperty({ example: '10:30AM' })
  openTimeWed!: string;

  @ApiProperty({ example: '10:30PM' })
  closeTimeWed!: string;


  @ApiProperty({ required: true })
  isOpenThu!: boolean;


  @ApiProperty({ example: '10:30AM' })
  openTimeThu!: string;

  @ApiProperty({ example: '10:30PM' })
  closeTimeThu!: string;


  @ApiProperty({ required: true })
  isOpenFri!: boolean;


  @ApiProperty({ example: '10:30AM' })
  openTimeFri!: string;

  @ApiProperty({ example: '10:30PM' })
  closeTimeFri!: string;


  @ApiProperty({ required: true })
  isOpenSat!: boolean;


  @ApiProperty({ example: '10:30AM' })
  openTimeSat!: string;

  @ApiProperty({ example: '10:30PM' })
  closeTimeSat!: string;


  @ApiProperty({ required: true })
  isOpenSun!: boolean;


  @ApiProperty({ example: '10:30AM' })
  openTimeSun!: string;

  @ApiProperty({ example: '10:30PM' })
  closeTimeSun!: string;

  @ApiProperty({ example: 'Addresss' })
  addressLine1?: string;

  @ApiProperty({ example: '' })
  addressLine2?: string;

  @ApiProperty({ example: 'NY' })
  city?: string;


  @ApiProperty({ example: '123-123-1234' })
  fax?: string;

  @ApiProperty({ required: true, example: '12345' })
  latitude?: number;


  @ApiProperty({ required: true, example: '12345' })
  longitude?: number;


  @ApiProperty({ required: true, example: '12345' })
  cities?: string[];

}
