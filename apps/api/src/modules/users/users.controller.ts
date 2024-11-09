import {
  Controller,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CurrentUser } from '~/decorators/user.decorator';
import { UserEntity } from '~/entities';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';
import { UserResponseMapper } from '~/mappers/UserResponseMapper';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({
    status: 200,
    description: 'Current user info',
    type: UserResponseDto,
  })
  async getMe(@CurrentUser() user: UserEntity): Promise<UserResponseDto> {
    return new UserResponseMapper().map(user);
  }
}
