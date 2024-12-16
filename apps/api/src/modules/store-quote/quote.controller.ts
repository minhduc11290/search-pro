import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '~/decorators';
import { QuoteResponseMapper } from '~/mappers/responses/QuoteResponseMapper';
import {
  MinCommentDto,
  QuoteCreationDto,
  QuoteFilterDto,
  QuoteResponseDto,
} from '~/share/dtos';
import { UserResponseDto } from '~/share/dtos/user-response.dto';
import { StoreQuoteService } from './quote.service';
import { RolesGuard } from '~/decorators/role-guard.decorator';
import { JwtGuard } from '../share/auth/guard';
import { QuoteStatus } from '~/share/consts/enums';

@ApiTags('Store - Quotes')
@Controller('store-quotes')
@RolesGuard('STORE_OWNER')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class StoreQuoteController {
  constructor(private readonly quoteService: StoreQuoteService) { }

  @Put(":quoteId")
  @ApiOperation({ summary: 'Respond quote' })
  @ApiResponse({ status: 200, type: [QuoteResponseDto] })
  async quoteProduct(
    @CurrentUser() user: UserResponseDto,
    @Param('quoteId') quoteId: string,
    @Body() quoteData: MinCommentDto,
  ): Promise<QuoteResponseDto> {
    console.log("quoteId", quoteId);
    const quote = await this.quoteService.respondQuote(quoteId, quoteData, user.id);

    const updatedQuote = await this.quoteService.findByQuoteId(quoteId);
    if (!updatedQuote) {
      throw new NotFoundException('Product not found');
    }
    return new QuoteResponseMapper().map(updatedQuote);
  }

  @Get()
  @ApiOperation({ summary: 'List Quotes' })
  @ApiResponse({ status: 200, type: [QuoteResponseDto] })
  async searchQuotes(
    @CurrentUser() user: UserResponseDto,
  ): Promise<QuoteResponseDto[]> {
    console.log("store", user.stores);
    const quotes = await this.quoteService.findByStore(user.stores);
    return new QuoteResponseMapper().mapArray(quotes);
  }

  @Get(':quoteId')
  @ApiOperation({ summary: 'Quote detail' })
  @ApiResponse({ status: 200, type: QuoteResponseDto })
  async getQuote(
    @Param('quoteId') quoteId: string,
    @CurrentUser() user: UserResponseDto,
  ): Promise<QuoteResponseDto> {
    if (user.stores.length == 0) {
      throw new NotFoundException('Store not found');
    }
    console.log("findByQuoteIdAndStore", quoteId);
    console.log("store", user.stores);
    const quote = await this.quoteService.findByQuoteIdAndStore(quoteId, user.stores);
    if (!quote) {
      throw new NotFoundException('Product not found');
    }
    // if (quote.status !== QuoteStatus.WAITING) {
    //   throw new BadRequestException('Quote is waiting for response');
    // }
    return new QuoteResponseMapper().map(quote);
  }
}
