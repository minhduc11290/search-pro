import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ProductDetailFilterDto {
  @ApiProperty({ required: false, example: '60540' })
  @IsString()
  @IsOptional()
  zipCode?: string;

  @ApiProperty({ required: false, example: 'Illinois' })
  @IsString()
  @IsOptional()
  steName?: string;
}
