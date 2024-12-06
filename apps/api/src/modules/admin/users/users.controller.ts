import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
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
  ) {
    let users = await this.userService.findByCondition({
      role: {
        role: UserRole.APP_USER
      }
    });

    console.log("users", users);
    return new UserResponseMapper().mapArray(users);
  }



}


