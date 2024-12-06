// import { PartialType } from '@nestjs/swagger';
// import { StoreCreationDto } from './store-creation.dto';
// export class StoreUpdatingDto extends PartialType(StoreCreationDto) {}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsBoolean } from 'class-validator';



export class StoreUpdatingDto {
    @ApiProperty({ example: 'Store Name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ example: '123-456-7890', required: false })
    @IsOptional()
    @IsString()
    primaryPhone?: string;

    @ApiProperty({ example: 'store@example.com', required: true })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsBoolean()
    isActive!: boolean;
}
