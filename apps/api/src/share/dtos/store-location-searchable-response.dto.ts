import { ApiProperty } from '@nestjs/swagger';
import { LocationStatus } from '../consts/enums';
import { MinAttachmentDto } from './product-location-response.dto';

export class StoreLocationSearchableResponseDto {
  @ApiProperty({
    required: true,
    example: '9da8b809-efdf-43ff-8ff5-03b364021fb6',
  })
  id!: string;

  

  @ApiProperty({ example: 'phone' })
  state?: string;

  @ApiProperty({ example: ['city'] })
  cities?: string[];




}
