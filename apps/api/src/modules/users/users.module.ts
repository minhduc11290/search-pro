import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RoleEntity, UserEntity } from '~/entities';
import { UsersController } from './users.controller';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity, RoleEntity])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
