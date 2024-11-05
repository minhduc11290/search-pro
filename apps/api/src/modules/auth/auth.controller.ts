import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseMapper } from '~/mappers/UserResponseMapper';
import AuthService from './auth.service';
import { UserCreationDto, UserCreationResponseDto, UserLoginDto } from './dto';
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
    type: UserCreationResponseDto,
  })
  async register(
    @Body() userCreationDto: UserCreationDto,
  ): Promise<UserCreationResponseDto> {
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
