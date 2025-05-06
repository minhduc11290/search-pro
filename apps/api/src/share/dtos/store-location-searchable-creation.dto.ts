import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsArray, IsNumber } from 'class-validator';
import { AttachmentDto } from './product-creation.dto';
import { Type } from 'class-transformer';

export class LocationSearchableCreationDto {
  @ApiProperty({ example: 'Location Name' })
  @IsString()
  state!: string;

  @ApiProperty({ required: false, example: ['keyword1', 'keyword2'] })
  @IsOptional()
  cities?: string[];

}
