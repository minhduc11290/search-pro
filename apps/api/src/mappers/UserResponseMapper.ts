import { UserEntity } from '~/entities';
import { BaseMapper } from './base/BaseMapper';
import { UserCreationResponseDto } from '~/modules/auth/dto';

export class UserResponseMapper extends BaseMapper<
  UserEntity,
  UserCreationResponseDto
> {
  map(source: UserEntity): UserCreationResponseDto {
    const userDto: UserCreationResponseDto = {
      id: source.id,
      email: source.email,
      userName: source.userName,
      firstName: source.firstName,
      lastName: source.lastName,
    };
    return userDto;
  }
}
