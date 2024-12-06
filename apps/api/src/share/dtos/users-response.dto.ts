import { ApiProperty } from '@nestjs/swagger';

export class UsersResponseDto {

  @ApiProperty({
    type: 'string',
    format: 'email',
    example: 'john@example.com',
  })
  email!: string;

  @ApiProperty({
    type: 'string',
    format: 'email',
    example: 'john@example.com',
  })
  phone!: string;

  @ApiProperty({
    type: 'string',
    format: 'email',
    example: 'john@example.com',
  })
  state!: string;

  @ApiProperty({
    type: 'string',
    format: 'email',
    example: 'john@example.com',
  })
  zip!: string;


}
