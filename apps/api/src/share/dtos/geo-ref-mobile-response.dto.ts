import { ApiProperty } from '@nestjs/swagger';

export class GeoRefMobileResponseDto {

  @ApiProperty({ required: true, example: '1234' })
  city!: string;

  @ApiProperty({ required: true, example: 'New Jersey' })
  steName!: string;
}
