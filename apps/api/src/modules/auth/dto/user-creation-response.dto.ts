import { ApiProperty } from '@nestjs/swagger';

export class UserCreationResponseDto {
  @ApiProperty({ example: '9da8b809-efdf-43ff-8ff5-03b364021fb6' })
  id: string;

  @ApiProperty({ example: 'johnson' })
  userName: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;
}
