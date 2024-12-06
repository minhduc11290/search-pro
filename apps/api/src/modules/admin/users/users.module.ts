import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../share/auth/strategy';
import TokenService from '../../share/auth/token.service';
import { UsersController } from './users.controller';
import UsersService from './users.service';
import { UserModule } from '~/modules/user/user.module';
import { UserService } from '~/modules/user/user.service';

@Module({
  imports: [UsersModule, UserModule, JwtModule.register({})],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, TokenService, UserService],
})
export class UsersModule { }
