import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UserLoginDto } from '../../../share/dtos';
import { UserLoginResponseDto } from '../../../share/dtos/user-login-response.dto';
import { JwtGuard } from '../../share/auth/guard/jwt.guard';
import TokenService from '../../share/auth/token.service';
import UsersService from './users.service';
import { RolesGuard } from '~/decorators/role-guard.decorator';
import { UsersResponseDto } from '~/share/dtos/users-response.dto';
import { UserResponseMapper } from '~/mappers/responses/UserResponseMapper';
import { UserRole } from '~/share/consts/enums';
import { UserEntity } from '~/entities';

@ApiTags('Admin - Users')
@Controller('admin/user-management')
@RolesGuard('SUPER_ADMIN')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class UsersController {
  
  constructor(
    private readonly userService: UsersService,
  ) { }


  @Get('/users')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all Users' })
  @ApiResponse({
    status: 200,
    type: UsersResponseDto,
    description: 'Return accessToken',
  })
  async getUsers(
    @Query('type') type: string,
  ) {
    console.log("type", type);
    let users: UserEntity[] = [];
    if (type == UserRole.ADMIN) {
      users = await this.userService.findByCondition({
        role: {
          role: UserRole.ADMIN
        }
      });
    }
    else {
      users = await this.userService.findByCondition({
        role: {
          role: UserRole.APP_USER
        }
      });
    }
    return new UserResponseMapper().mapArray(users);
  }



}


