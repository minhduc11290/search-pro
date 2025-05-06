import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsArray, IsNumber } from 'class-validator';
import { AttachmentDto } from './product-creation.dto';
import { Type } from 'class-transformer';

export class CategoryCreationDto {
  @ApiProperty({ example: 'Location Name' })
  @IsString()
  name!: string;

  @ApiProperty({ required: false, example: 'a.png' })
  @IsString()
  url!: string;

  @ApiProperty({ required: false, example: 'a.png' })
  @IsString()
  productUrl!: string;

}
