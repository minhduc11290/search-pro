import { Body, Controller, Post } from '@nestjs/common';
import { UserCreationDto, UserLoginDto } from './dto';
import AuthService from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() userCreationDto: UserCreationDto) {
    return this.authService.register(userCreationDto);
  }

  @Post('login')
  login(@Body() userLoginDto: UserLoginDto) {
    return this.authService.login(userLoginDto);
  }
}
