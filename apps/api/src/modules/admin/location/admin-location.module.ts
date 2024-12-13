import { Module } from '@nestjs/common';
import { CustomGuard } from '~/decorators/custom-guard.decorator';
import { AdminLocationController } from './admin-location.controller';
import { AdminLocationService } from './admin-location.service';
import { JwtService } from '@nestjs/jwt';
import { GeoRefService } from '~/modules/share/geo-ref/geo-ref.service';
import { GeoRefModule } from '~/modules/share/geo-ref/geo-ref.module';


@Module({
  imports: [GeoRefModule],
  providers: [AdminLocationService, JwtService, CustomGuard, GeoRefService],
  controllers: [AdminLocationController],
  exports: [AdminLocationService],
})
export class AdminLocationModule { }
