import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
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
import AdminUserService from './admin-user.service';
import { RolesGuard } from '~/decorators/role-guard.decorator';
import { Response } from 'express';
import { CurrentUser } from '~/decorators';
import { UserResponseDto } from '~/share/dtos/user-response.dto';

@ApiTags('System - Users')
@Controller('admin/users')
export class AdminUserController {
  constructor(
    private readonly userService: AdminUserService,
    private readonly tokenService: TokenService,
  ) { }


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
    @Res() res: Response
  ) {
    console.log("Vô đây 1");
    let user = await this.userService.login(userLoginDto);
    console.log("Vô đây 2");
    // res.cookie('authToken', user.accessToken, {
    //   httpOnly: true,  // Bảo vệ chống XSS
    //   secure: false, // Chỉ gửi qua HTTPS nếu ở production
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    //   sameSite: 'strict', // Chống CSRF
    // });
    res.cookie('authToken', 'your-access-token', {
      httpOnly: true, // Bảo vệ chống XSS
      secure: false, // Ở localhost, dùng false. Production thì phải là true.
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      sameSite: 'lax', // Lax giúp cookie vẫn hoạt động trên domain khác
    });
    console.log("Vô đây lax");
    return res.json(user);
  }

  @UseGuards(JwtGuard)
  @RolesGuard('SUPER_ADMIN')
  @Post('logout')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Req() req: Request): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = authHeader.split(' ')[1];
    await this.tokenService.toBlacklist(token);
  }


  @Get('me')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get current user info' })
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Current user info',
    type: UserResponseDto,
  })
  getMe(@CurrentUser() user: UserResponseDto): UserResponseDto {
    return user;
  }


  // @Get('/delete-id/:token')
  // @UseGuards(JwtGuard)
  // @ApiOperation({ summary: 'Get current user info' })
  // @HttpCode(200)
  // @ApiResponse({
  //   status: 200,
  //   description: 'Current user info',
  //   type: UserResponseDto,
  // })
  // deleteMe(@CurrentUser() user: UserResponseDto,
  //   @Param('storeId') storeId: string,): UserResponseDto {
  //   return user;
  // }


}


