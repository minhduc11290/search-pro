import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  GoneException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '~/decorators';
import { RolesGuard } from '~/decorators/role-guard.decorator';
import { StoreCreationEntityMapper } from '~/mappers/entities/StoreCreationEntityMapper';
import { StoreResponseMapper } from '~/mappers/responses/StoreResponseMapper';
import { JwtGuard } from '~/modules/share/auth/guard';
import {
  StoreCreationDto,
  StoreOwnerCreationDto,
  StoreUpdatingDto,
} from '~/share/dtos';
import { StoreResponseDto } from '~/share/dtos/store-response.dto';
import { UserResponseDto } from '~/share/dtos/user-response.dto';
import AdminUserService from '../user/admin-user.service';
import { AdminStoreService } from './admin-store.service';
import { StoreStatus, UserRole } from '~/share/consts/enums';
import { UserService } from '~/modules/user/user.service';

@ApiTags('System - Stores')
@Controller('admin/stores')
@RolesGuard('SUPER_ADMIN', 'STORE_OWNER')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class AdminStoreController {
  constructor(
    private readonly adminStoreService: AdminStoreService,
    private readonly adminUserService: AdminUserService
  ) { }

  // : Promise<StoreResponseDto[]>
  @Get()
  @ApiOperation({ summary: 'List all stores' })
  @ApiResponse({ status: 200, type: [StoreResponseDto] })
  async getStores(@CurrentUser() user: UserResponseDto) {
    const _isSuperAdmin = await this.adminUserService.checkIsSuperAdmin(user.id);

    if (_isSuperAdmin) {
      const stores = await this.adminStoreService.findByCondition({});
      return new StoreResponseMapper().mapArray(stores);
    } else {
      // const stores = await this.adminStoreService.findByCondition({storeId: user.id});
      const stores = await this.adminStoreService.findByCondition({
        owners: [user.id],
      });
      return new StoreResponseMapper().mapArray(stores);
    }


  }

  @Get(':storeId')
  @ApiOperation({ summary: 'Get store detail' })
  @ApiResponse({ status: 200, type: StoreResponseDto })
  async getStore(
    @CurrentUser() _: UserResponseDto,
    @Param('storeId') storeId: string,
  ): Promise<StoreResponseDto | null> {
    const store = await this.adminStoreService.findById(storeId);
    if (!store) {
      return null;
    }
    return new StoreResponseMapper().map(store);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new store' })
  @ApiResponse({ status: 201, type: StoreResponseDto })
  async createStore(
    @CurrentUser() user: UserResponseDto,
    @Body() storeCreationDto: StoreCreationDto,
  ): Promise<StoreResponseDto> {
    // const storeOwner = this.userService.createUser({
    //   email: storeCreationDto.email,
    //   password: storeCreationDto.password,
    //   phone: storeCreationDto.primaryPhone
    // });
    const creationData = new StoreCreationEntityMapper().map(storeCreationDto);
    const store = await this.adminStoreService.create({
      ...creationData,
      createdBy: user.id,
    });

    await this.adminStoreService.createOwner(store, {
      firstName: '',
      lastName: '',
      email: storeCreationDto.email,
      phone: storeCreationDto.primaryPhone ?? '',
      isActive: storeCreationDto.isActive,
      password: storeCreationDto.password
    });
    return new StoreResponseMapper().map(store);
  }

  @Post(':storeId/owners')
  @ApiOperation({ summary: 'Create store owner' })
  @ApiResponse({ status: 201, type: StoreResponseDto })
  async createStoreOwner(
    @CurrentUser() user: UserResponseDto,
    @Param('storeId') storeId: string,
    @Body() storeOwnerDto: StoreOwnerCreationDto,
  ): Promise<StoreResponseDto> {
    const owner = await this.adminUserService.findByEmail(storeOwnerDto.email);
    if (owner) {
      throw new ConflictException('User with provided email already exists');
    }

    const store = await this.adminStoreService.findById(storeId);
    if (!store) {
      throw new GoneException('Store not found');
    }
    await this.adminStoreService.createOwner(store, storeOwnerDto);
    return new StoreResponseMapper().map(store);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a store' })
  @ApiResponse({ status: 200, type: StoreResponseDto })
  async updateStore(
    @CurrentUser() user: UserResponseDto,
    @Param('id') id: string,
    @Body() updateStoreDto: StoreUpdatingDto,
  ): Promise<StoreResponseDto> {
    const _store = await this.adminStoreService.findById(id);
    const store = await this.adminStoreService.update(id, {
      email: updateStoreDto.email ?? (_store?.email ?? ""),
      name: updateStoreDto.name ?? (_store?.name ?? ""),
      primaryPhone: updateStoreDto.primaryPhone ?? (_store?.primaryPhone ?? ""),
      status: updateStoreDto.isActive ? StoreStatus.ACTIVE : StoreStatus.INACTIVE,
      updatedBy: user.id,
    });
    console.log(store);
    return new StoreResponseMapper().map(store);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Inactive a store' })
  @ApiResponse({ status: 200 })
  async deleteStore(@Param('id') id: string): Promise<void> {
    return this.adminStoreService.softDelete(id);
  }
}
