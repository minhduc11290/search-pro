import { UserEntity } from '~/entities';
import { UserResponseDto } from '~/share/dtos/user-response.dto';
import { BaseMapper } from '../base/BaseMapper';
import { UserStatus } from '~/share/consts/enums';

export class UserResponseMapper extends BaseMapper<
  UserEntity,
  UserResponseDto
> {
  map(source: UserEntity): UserResponseDto {
    const userDto: UserResponseDto = {
      id: source.id,
      email: source.email,
      userName: source.userName,
      firstName: source.firstName ?? '',
      lastName: source.lastName ?? '',
      phone: source.phone ?? '',
      status: source.status ?? UserStatus.INACTIVE,
      role: {
        id: source?.role.id,
        value: source?.role.role,
      },
      stores: source?.stores?.map((store) => ({
        id: store.id,
        value: store.name,
      })),
    };
    return userDto;
  }


}
