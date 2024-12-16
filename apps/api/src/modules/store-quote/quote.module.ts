import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomGuard } from '~/decorators/custom-guard.decorator';
import { StoreQuoteController } from './quote.controller';
import { StoreQuoteService } from './quote.service';

@Module({
  imports: [],
  providers: [StoreQuoteService, JwtService, CustomGuard],
  controllers: [StoreQuoteController],
  exports: [StoreQuoteService],
})
export class StoreQuoteModule { }
