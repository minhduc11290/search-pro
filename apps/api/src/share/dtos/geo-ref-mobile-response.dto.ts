import { ApiProperty } from '@nestjs/swagger';

export class GeoRefMobileResponseDto {

  @ApiProperty({ required: true, example: '1234' })
  zipCode!: string;

  @ApiProperty({ required: true, example: 'New Jersey' })
  steName!: string;
}
