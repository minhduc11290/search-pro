import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsArray, IsNumber } from 'class-validator';
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


  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  isOpenMon!: boolean;


  @ApiProperty({ example: '10:30AM' })
  @IsString()
  openTimeMon!: string;

  @ApiProperty({ example: '10:30PM' })
  @IsString()
  closeTimeMon!: string;


  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  isOpenTue!: boolean;


  @ApiProperty({ example: '10:30AM' })
  @IsString()
  openTimeTue!: string;

  @ApiProperty({ example: '10:30PM' })
  @IsString()
  closeTimeTue!: string;


  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  isOpenWed!: boolean;


  @ApiProperty({ example: '10:30AM' })
  @IsString()
  openTimeWed!: string;

  @ApiProperty({ example: '10:30PM' })
  @IsString()
  closeTimeWed!: string;


  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  isOpenThu!: boolean;


  @ApiProperty({ example: '10:30AM' })
  @IsString()
  openTimeThu!: string;

  @ApiProperty({ example: '10:30PM' })
  @IsString()
  closeTimeThu!: string;


  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  isOpenFri!: boolean;


  @ApiProperty({ example: '10:30AM' })
  @IsString()
  openTimeFri!: string;

  @ApiProperty({ example: '10:30PM' })
  @IsString()
  closeTimeFri!: string;


  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  isOpenSat!: boolean;


  @ApiProperty({ example: '10:30AM' })
  @IsString()
  openTimeSat!: string;

  @ApiProperty({ example: '10:30PM' })
  @IsString()
  closeTimeSat!: string;


  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  isOpenSun!: boolean;


  @ApiProperty({ example: '10:30AM' })
  @IsString()
  openTimeSun!: string;

  @ApiProperty({ example: '10:30PM' })
  @IsString()
  closeTimeSun!: string;

  @ApiProperty({ example: 'Addresss' })
  @IsString()
  addressLine1!: string;

  @ApiProperty({ example: '' })
  @IsString()
  addressLine2?: string;

  @ApiProperty({ example: 'NY' })
  @IsString()
  city!: string;


  @ApiProperty({ example: '123-123-1234' })
  @IsString()
  fax?: string;


  @ApiProperty({ required: true, example: '12345' })
  @IsNumber()
  latitude!: number;


  @ApiProperty({ required: true, example: '12345' })
  @IsNumber()
  longitude!: number;

}
