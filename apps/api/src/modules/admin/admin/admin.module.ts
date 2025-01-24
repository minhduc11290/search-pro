import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomGuard } from '~/decorators/custom-guard.decorator';
import { AdminAdminController } from './admin.controller';
import { AdminAdminService } from './admin.service';
import { AdminUserModule } from '../user/admin-user.module';
import AdminUserService from '../user/admin-user.service';
import TokenService from '~/modules/share/auth/token.service';

@Module({
  imports: [AdminUserModule],
  providers: [
    AdminAdminService,
    JwtService,
    CustomGuard,
    AdminUserService,
    TokenService,
  ],
  controllers: [AdminAdminController],
  exports: [AdminAdminService],
})
export class AdminAdminModule { }
