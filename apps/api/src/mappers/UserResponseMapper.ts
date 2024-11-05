import { UserEntity } from '~/entities';
import { Mapper } from './base/Mapper';
import { UserCreationResponseDto } from '~/modules/auth/dto';

export class UserResponseMapper extends Mapper<
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
