import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Put
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '~/decorators';
import { RolesGuard } from '~/decorators/role-guard.decorator';
import { LocationCreationEntityMapper } from '~/mappers/entities/LocationCreationEntityMapper';
import { StoreLocationResponseMapper } from '~/mappers/responses/StoreLocationResponseMapper';
import { JwtGuard } from '~/modules/share/auth/guard';
import { LocationSearchableCreationDto, StoreLocationResponseDto, StoreLocationSearchableResponseDto } from '~/share/dtos';
import { LocationCreationDto } from '~/share/dtos/store-location-creation.dto';
import { UserResponseDto } from '~/share/dtos/user-response.dto';
import { CategoriesService } from './categories.service';
import { LocationStatus } from '~/share/consts/enums';
import { GeoRefService } from '~/modules/share/geo-ref/geo-ref.service';
import { AttachmentDto } from '~/share/dtos/product-creation.dto';
import { AttachmentEntity } from '~/entities';

import { latLngToCell } from "h3-js";
import { AdminStoreService } from '../store/admin-store.service';
import { CategoryResponseDto } from '~/share/dtos/category-response.dto';
import { CategoryResponseMapper } from '~/mappers/responses/CategoryResponseMapper';
import { CategoryCreationDto } from '~/share/dtos/category-creation.dto';

@ApiTags('System - Locations Searchable')
@Controller('admin')
@RolesGuard('SUPER_ADMIN')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService
  ) { }

  @Get('categories')
  @ApiOperation({ summary: 'Location searchable list' })
  @ApiResponse({ status: 200, type: [CategoryResponseDto] })
  async getLocations(
  ): Promise<CategoryResponseDto[]> {
    const categories = await this.categoriesService.findByCondition({
    });
    return new CategoryResponseMapper().mapArray(categories);
  }

  @Get('categories/:categoryId')
  @ApiOperation({ summary: 'Get location detail' })
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  async getLocation(
    @CurrentUser() _: UserResponseDto,
    @Param('categoryId') categoryId: string,
  ): Promise<CategoryResponseDto | null> {
    const location = await this.categoriesService.findById(categoryId);
    if (!location) {
      return null;
    }
    return new CategoryResponseMapper().map(location);
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create a new location' })
  @ApiResponse({ status: 201, type: CategoryCreationDto })
  async create(
    @Param('storeId') storeId: string,
    @CurrentUser() user: UserResponseDto,
    @Body() categoryDto: CategoryCreationDto,
  ): Promise<CategoryResponseDto> {

    const category = await this.categoriesService.create({
      name: categoryDto.name,
      url: categoryDto.url,
      productUrl: categoryDto.productUrl

    });
    return new CategoryResponseMapper().map(category);

  }


  @Put('/categories/:categoryId')
  @ApiOperation({ summary: 'Update a Location' })
  @ApiResponse({ status: 200, type: StoreLocationResponseDto })
  async updateStore(
    @CurrentUser() user: UserResponseDto,
    @Param('categoryId') categoryId: string,
    @Body() categoryDto: CategoryCreationDto,
  ): Promise<CategoryResponseDto | null> {
    const category = await this.categoriesService.findById(categoryId);
    console.log("debug", categoryDto);
    if (category) {
      const location = await this.categoriesService.update(categoryId, {
        name: categoryDto.name,
        url: categoryDto.url,
        productUrl: categoryDto.productUrl
      });

      return new CategoryResponseMapper().map(location);
    } else {
      return null;
    }

  }

  @Delete('/categories/:categoryId')
  @ApiOperation({ summary: 'Inactive a location' })
  @ApiResponse({ status: 200 })
  async deleteLocation(@Param('categoryId') categoryId: string): Promise<void> {
    return this.categoriesService.delete(categoryId);
  }


}
