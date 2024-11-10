import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { StoreEntity } from '~/entities';
import { StoreCreationDto, StoreUpdatingDto } from '~/shares/dtos';
import { JwtGuard } from '../auth/guard';
import { CurrentUser } from '~/decorators';
import { UserResponseDto } from '~/shares/dtos/user-response.dto';
import { StoreCreationEntityMapper } from '~/mappers/entities/StoreCreationEntityMapper';

@ApiTags('stores')
@Controller('stores')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  @ApiOperation({ summary: 'List all stores' })
  @ApiResponse({ status: 200, type: [StoreEntity] })
  async findAll(): Promise<StoreEntity[]> {
    return this.storesService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new store' })
  @ApiResponse({ status: 201, type: StoreEntity })
  async create(
    @CurrentUser() user: UserResponseDto,
    @Body() createStoreDto: StoreCreationDto,
  ): Promise<StoreEntity> {
    const creationData = new StoreCreationEntityMapper().map(createStoreDto, {
      owner: user.id,
    });
    return this.storesService.create(creationData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a store' })
  @ApiResponse({ status: 200, type: StoreEntity })
  async update(
    @Param('id') id: string,
    @Body() updateStoreDto: StoreUpdatingDto,
  ): Promise<StoreEntity> {
    return this.storesService.update(id, updateStoreDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Inactive a store' })
  @ApiResponse({ status: 200 })
  async softDelete(@Param('id') id: string): Promise<void> {
    return this.storesService.softDelete(id);
  }
}
