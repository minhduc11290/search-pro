import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
