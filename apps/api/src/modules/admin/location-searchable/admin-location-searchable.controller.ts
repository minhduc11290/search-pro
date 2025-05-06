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
import { AdminLocationSearchableService } from './admin-location-searchable.service';
import { LocationStatus } from '~/share/consts/enums';
import { GeoRefService } from '~/modules/share/geo-ref/geo-ref.service';
import { AttachmentDto } from '~/share/dtos/product-creation.dto';
import { AttachmentEntity } from '~/entities';

import { latLngToCell } from "h3-js";

import { AdminStoreService } from '../store/admin-store.service';
import { StoreLocationSearchableResponseMapper } from '~/mappers/responses/StoreLocationSearchableResponseMapper';

@ApiTags('System - Locations Searchable')
@Controller('admin')
@RolesGuard('SUPER_ADMIN', 'ADMIN')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class AdminLocationSearchableController {
  constructor(private readonly adminLocationService: AdminLocationSearchableService,
    private readonly adminStoreService: AdminStoreService
  ) { }

  @Get('stores/:storeId/locations-searchable')
  @ApiOperation({ summary: 'Location searchable list' })
  @ApiResponse({ status: 200, type: [StoreLocationResponseDto] })
  async getLocations(
    @Param('storeId') storeId: string,
  ): Promise<StoreLocationSearchableResponseDto[]> {
    const locations = await this.adminLocationService.findByCondition({
      store: storeId,
    });
    return new StoreLocationSearchableResponseMapper().mapArray(locations);
  }

  @Get('stores/:storeId/locations-searchable/:locationId')
  @ApiOperation({ summary: 'Get location detail' })
  @ApiResponse({ status: 200, type: StoreLocationResponseDto })
  async getLocation(
    @CurrentUser() _: UserResponseDto,
    @Param('locationId') locationId: string,
  ): Promise<StoreLocationSearchableResponseDto | null> {
    const location = await this.adminLocationService.findById(locationId);
    if (!location) {
      return null;
    }
    return new StoreLocationSearchableResponseMapper().map(location);
  }

  @Post('stores/:storeId/locations-searchable/')
  @ApiOperation({ summary: 'Create a new location' })
  @ApiResponse({ status: 201, type: LocationSearchableCreationDto })
  async create(
    @Param('storeId') storeId: string,
    @CurrentUser() user: UserResponseDto,
    @Body() locationCreationDto: LocationSearchableCreationDto,
  ): Promise<StoreLocationSearchableResponseDto> {

    const location = await this.adminLocationService.create({
      store: storeId,
      steName: locationCreationDto.state,
      cities: locationCreationDto.cities ?? []
    });
    return new StoreLocationSearchableResponseMapper().map(location);

  }


  @Put('/stores/:storeId/locations-searchable/:locationId')
  @ApiOperation({ summary: 'Update a Location' })
  @ApiResponse({ status: 200, type: StoreLocationResponseDto })
  async updateStore(
    @CurrentUser() user: UserResponseDto,
    @Param('locationId') locationId: string,
    @Param('storeId') storeId: string,
    @Body() locationCreationDto: LocationSearchableCreationDto,
  ): Promise<StoreLocationSearchableResponseDto | null> {
    const store = await this.adminStoreService.findById(storeId);
    if (store) {
      const location = await this.adminLocationService.update(locationId, {
        store: store,
        steName: locationCreationDto.state,
        cities: locationCreationDto.cities ?? []
      });



      return new StoreLocationSearchableResponseMapper().map(location);
    } else {
      return null;
    }

  }

  @Delete('/stores/:storeId/locations-searchable/:locationId')
  @ApiOperation({ summary: 'Inactive a location' })
  @ApiResponse({ status: 200 })
  async deleteLocation(@Param('locationId') locationId: string): Promise<void> {
    return this.adminLocationService.delete(locationId);
  }



  // @Delete('/attachment/:attachmentId')
  // @ApiOperation({ summary: 'Delete an attachments product' })
  // @ApiResponse({ status: 200 })
  // async deleteAttachment(
  //   @Param('attachmentId') attachmentId: string,
  // ): Promise<void> {
  //   return this.adminLocationService.deleteAttachment(
  //     attachmentId
  //   );

  // }

}
