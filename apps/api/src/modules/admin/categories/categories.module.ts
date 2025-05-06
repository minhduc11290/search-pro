import { Module } from '@nestjs/common';
import { CustomGuard } from '~/decorators/custom-guard.decorator';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { JwtService } from '@nestjs/jwt';
import { GeoRefService } from '~/modules/share/geo-ref/geo-ref.service';
import { GeoRefModule } from '~/modules/share/geo-ref/geo-ref.module';


@Module({
  imports: [GeoRefModule],
  providers: [CategoriesService, JwtService, CustomGuard, GeoRefService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule { }
