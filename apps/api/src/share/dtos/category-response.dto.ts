import { ApiProperty } from '@nestjs/swagger';
import { LocationStatus } from '../consts/enums';
import { MinAttachmentDto } from './product-location-response.dto';


export class CategoryResponseDto {

  @ApiProperty({ required: true, })
  name!: string;

  @ApiProperty({ required: true, })
  id!: string;

  @ApiProperty({ required: true, })
  url!: string;

  @ApiProperty({ required: true, })
  productUrl!: string;

}
