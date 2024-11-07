import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseMapper } from '~/mappers/UserResponseMapper';
import { UserResponseDto } from '../users/dto/user-response.dto';
import AuthService from './auth.service';
import { UserCreationDto, UserLoginDto } from './dto';
import { UserLoginResponseDto } from './dto/user-login-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: UserResponseDto,
  })
  async register(
    @Body() userCreationDto: UserCreationDto,
  ): Promise<UserResponseDto> {
    const user = await this.authService.register(userCreationDto);
    return new UserResponseMapper().map(user);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    type: UserLoginResponseDto,
    description: 'Return accessToken',
  })
  async login(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<UserLoginResponseDto> {
    return this.authService.login(userLoginDto);
  }
}
