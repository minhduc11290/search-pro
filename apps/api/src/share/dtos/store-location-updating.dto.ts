import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class LocationCreationDto {
  @ApiProperty({ example: 'Location Name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '123 Hong Bang street' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: '10:30AM' })
  @IsOptional()
  @IsString()
  openTime?: string;

  @ApiProperty({ example: '10:30PM' })
  @IsOptional()
  @IsString()
  closeTime?: string;

  @ApiProperty({ example: '9da8b809-efdf-43ff-8ff5-03b364021fb6' })
  @IsOptional()
  @IsString()
  geoRefId?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  isActive!: boolean;

}
