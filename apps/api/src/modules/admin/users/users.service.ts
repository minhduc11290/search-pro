import { AutoPath, EntityManager, FilterQuery } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '~/entities';


@Injectable()
export default class UsersService {
  constructor(
    private readonly em: EntityManager
  ) { }

  public defaultPopulate: AutoPath<UserEntity, any> = [
    'stores',
  ] as never[];

  private getPopulates(populate?: string[]) {
    if (populate) {
      return populate as never[];
    }
    return this.defaultPopulate as never[];
  }

  async findByCondition(condition: FilterQuery<UserEntity>, populate?: string[]): Promise<UserEntity[]> {
    return this.em.find(
      UserEntity, condition,
      { populate: this.getPopulates(populate), orderBy: { createdAt: 'DESC' } },
    );
  }
}
