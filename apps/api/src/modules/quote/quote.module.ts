import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomGuard } from '~/decorators/custom-guard.decorator';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { AdminLocationService } from '../admin/location/admin-location.service';

@Module({
  imports: [],
  providers: [QuoteService, JwtService, CustomGuard,AdminLocationService],
  controllers: [QuoteController],
  exports: [QuoteService],
})
export class QuoteModule {}
