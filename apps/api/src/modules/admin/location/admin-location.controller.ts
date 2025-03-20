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
import { StoreLocationResponseDto } from '~/share/dtos';
import { LocationCreationDto } from '~/share/dtos/store-location-creation.dto';
import { UserResponseDto } from '~/share/dtos/user-response.dto';
import { AdminLocationService } from './admin-location.service';
import { LocationStatus } from '~/share/consts/enums';
import { GeoRefService } from '~/modules/share/geo-ref/geo-ref.service';
import { AttachmentDto } from '~/share/dtos/product-creation.dto';
import { AttachmentEntity } from '~/entities';

import { latLngToCell } from "h3-js";

@ApiTags('System - Locations')
@Controller('admin')
@RolesGuard('SUPER_ADMIN', 'ADMIN')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class AdminLocationController {
  constructor(private readonly adminLocationService: AdminLocationService,
    private readonly geoService: GeoRefService
  ) { }

  @Get('stores/:storeId/locations')
  @ApiOperation({ summary: 'Location list' })
  @ApiResponse({ status: 200, type: [StoreLocationResponseDto] })
  async getLocations(
    @Param('storeId') storeId: string,
  ): Promise<StoreLocationResponseDto[]> {
    const locations = await this.adminLocationService.findByCondition({
      store: storeId,
    });
    console.log("locations", locations);
    return new StoreLocationResponseMapper().mapArray(locations);
  }

  @Get('stores/:storeId/locations/:locationId')
  @ApiOperation({ summary: 'Get location detail' })
  @ApiResponse({ status: 200, type: StoreLocationResponseDto })
  async getLocation(
    @CurrentUser() _: UserResponseDto,
    @Param('locationId') locationId: string,
  ): Promise<StoreLocationResponseDto | null> {
    const location = await this.adminLocationService.findById(locationId);
    if (!location) {
      return null;
    }
    return new StoreLocationResponseMapper().map(location);
  }

  @Post('stores/:storeId/locations/')
  @ApiOperation({ summary: 'Create a new location' })
  @ApiResponse({ status: 201, type: StoreLocationResponseDto })
  async create(
    @Param('storeId') storeId: string,
    @CurrentUser() user: UserResponseDto,
    @Body() locationCreationDto: LocationCreationDto,
  ): Promise<StoreLocationResponseDto> {
    const creationData = new LocationCreationEntityMapper().map(
      locationCreationDto,
      { storeId, createdBy: user.id },
    );
    const h3Index = latLngToCell(creationData.latitude!, creationData.longitude!, 7);

    const location = await this.adminLocationService.create({
      ...creationData,
      h3Index: h3Index,
      createdBy: user.id,
    }, locationCreationDto.attachments);


    return new StoreLocationResponseMapper().map(location);
  }


  @Put('/stores/:storeId/locations/:locationId')
  @ApiOperation({ summary: 'Update a Location' })
  @ApiResponse({ status: 200, type: StoreLocationResponseDto })
  async updateStore(
    @CurrentUser() user: UserResponseDto,
    @Param('locationId') locationId: string,
    @Body() locationCreationDto: LocationCreationDto,
  ): Promise<StoreLocationResponseDto | null> {

    const _location = await this.adminLocationService.findById(locationId);
    if (!_location) {
      return null;
    }

    const status = locationCreationDto.isActive ? LocationStatus.ACTIVE : LocationStatus.INACTIVE;
    const geoRefId = locationCreationDto.geoRefId ?? _location.geoRef.id;
    const geo = await this.geoService.findById(geoRefId);
    if (!geo) {
      return null;
    }
    const h3Index = latLngToCell(locationCreationDto.latitude!, locationCreationDto.longitude!, 7);
    const location = await this.adminLocationService.update(locationId, {
      name: locationCreationDto.name ?? _location.name,
      address: locationCreationDto.address ?? _location.address,
      openTime: locationCreationDto.openTime ?? _location.openTime,
      closeTime: locationCreationDto.closeTime ?? _location.closeTime,
      geoRef: geo,
      status: status,
      updatedBy: user.id,
      phone: locationCreationDto.phone ?? _location.phone,
      addressLine1: locationCreationDto.addressLine1 ?? _location.addressLine1,
      addressLine2: locationCreationDto.addressLine2 ?? _location.addressLine2,
      city: locationCreationDto.city ?? _location.city,

      isOpenMon: locationCreationDto.isOpenMon ?? _location.isOpenMon,
      openTimeMon: locationCreationDto.openTimeMon ?? _location.openTimeMon,
      closeTimeMon: locationCreationDto.closeTimeMon ?? _location.closeTimeMon,

      isOpenTue: locationCreationDto.isOpenTue ?? _location.isOpenTue,
      openTimeTue: locationCreationDto.openTimeTue ?? _location.openTimeTue,
      closeTimeTue: locationCreationDto.closeTimeTue ?? _location.closeTimeTue,

      isOpenWed: locationCreationDto.isOpenWed ?? _location.isOpenWed,
      openTimeWed: locationCreationDto.openTimeWed ?? _location.openTimeWed,
      closeTimeWed: locationCreationDto.closeTimeWed ?? _location.closeTimeWed,

      isOpenThu: locationCreationDto.isOpenThu ?? _location.isOpenThu,
      openTimeThu: locationCreationDto.openTimeThu ?? _location.openTimeThu,
      closeTimeThu: locationCreationDto.closeTimeThu ?? _location.closeTimeThu,

      isOpenFri: locationCreationDto.isOpenFri ?? _location.isOpenFri,
      openTimeFri: locationCreationDto.openTimeFri ?? _location.openTimeFri,
      closeTimeFri: locationCreationDto.closeTimeFri ?? _location.closeTimeFri,

      isOpenSat: locationCreationDto.isOpenSat ?? _location.isOpenSat,
      openTimeSat: locationCreationDto.openTimeSat ?? _location.openTimeSat,
      closeTimeSat: locationCreationDto.closeTimeSat ?? _location.closeTimeSat,

      isOpenSun: locationCreationDto.isOpenSun ?? _location.isOpenSun,
      openTimeSun: locationCreationDto.openTimeSun ?? _location.openTimeSun,
      closeTimeSun: locationCreationDto.closeTimeSun ?? _location.closeTimeSun,

      h3Index: h3Index,
      latitude: locationCreationDto.latitude ?? _location.latitude,
      longitude: locationCreationDto.longitude ?? _location.longitude,
    });

    

    return new StoreLocationResponseMapper().map(location);


  }

  @Delete('/stores/:storeId/locations/:locationId')
  @ApiOperation({ summary: 'Inactive a location' })
  @ApiResponse({ status: 200 })
  async deleteLocation(@Param('id') id: string): Promise<void> {
    return this.adminLocationService.softDelete(id);
  }


  @Post('/locations/:locationId/attachment')
  @ApiOperation({ summary: 'Add an attachments product' })
  @ApiResponse({ status: 200 })
  async addAttachment(
    @Param('locationId') locationId: string,
    @Body() attachments: AttachmentDto[],
  ): Promise<AttachmentEntity[]> {
    return this.adminLocationService.addAttachment(
      locationId,
      attachments
    );

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
