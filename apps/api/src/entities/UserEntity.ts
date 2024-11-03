import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { IsEmail } from 'class-validator';
import { UserStatus } from 'src/const/enums';
import { RoleEntity, StoreEntity } from '.';
import { BaseEntity } from './BaseEntity';

@Entity({ tableName: 'users' })
export class UserEntity extends BaseEntity<UserEntity> {
  @Property({ length: 100 })
  @Unique()
  userName!: string;

  @Property({ length: 100, nullable: true })
  firstName?: string;

  @Property({ length: 100, nullable: true })
  lastName?: string;

  @Property({ length: 100, nullable: true })
  password?: string;

  @Property({ length: 100 })
  @IsEmail()
  @Unique()
  email!: string;

  @Property({ default: false })
  emailVerified: boolean = false;

  @Property({ nullable: true })
  verifyToken?: string;

  @ManyToOne(() => RoleEntity)
  role!: RoleEntity;

  @ManyToMany(() => StoreEntity, 'owners')
  stores = new Collection<StoreEntity>(this);

  @Enum({ items: () => UserStatus, nullable: false })
  status?: UserStatus = UserStatus.PENDING;

  @Property({ persist: false, nullable: true, name: 'fullName' })
  public getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
