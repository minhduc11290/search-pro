import { Module } from '@nestjs/common';
import { CustomGuard } from '~/decorators/custom-guard.decorator';
import { AdminLocationSearchableController } from './admin-location-searchable.controller';
import { AdminLocationSearchableService } from './admin-location-searchable.service';
import { JwtService } from '@nestjs/jwt';
import { GeoRefService } from '~/modules/share/geo-ref/geo-ref.service';
import { GeoRefModule } from '~/modules/share/geo-ref/geo-ref.module';
import { AdminStoreService } from '../store/admin-store.service';


@Module({
  imports: [GeoRefModule],
  providers: [AdminLocationSearchableService, JwtService, CustomGuard, GeoRefService, AdminStoreService],
  controllers: [AdminLocationSearchableController],
  exports: [AdminLocationSearchableService],
})
export class AdminLocationSearchableModule { }
