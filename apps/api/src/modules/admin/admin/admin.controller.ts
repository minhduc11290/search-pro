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
import { AdminAdminService } from './admin.service';
import { StoreStatus, UserRole, UserStatus } from '~/share/consts/enums';
import { UserService } from '~/modules/user/user.service';
import { UserEntity } from '~/entities';

@ApiTags('System - Admins')
@Controller('admin/admin')
@RolesGuard('SUPER_ADMIN')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class AdminAdminController {
  constructor(
    private readonly adminAdminService: AdminAdminService,
    private readonly adminUserService: AdminUserService
  ) { }

  // : Promise<StoreResponseDto[]>
  // @Get()
  // @ApiOperation({ summary: 'List all admin' })
  // @ApiResponse({ status: 200, type: [StoreResponseDto] })
  // async getStores(@CurrentUser() user: UserResponseDto) {
  //   const _isSuperAdmin = await this.adminUserService.checkIsSuperAdmin(user.id);
  //   const _isAdmin = await this.adminUserService.checkIsAdmin(user.id);

  //   if (_isSuperAdmin) {
  //     const stores = await this.adminStoreService.findByCondition({});
  //     return new StoreResponseMapper().mapArray(stores);
  //   } else if (_isAdmin) {
  //     const stores = await this.adminStoreService.findByCondition({
  //       createdBy: user.id,
  //     });
  //     return new StoreResponseMapper().mapArray(stores);
  //   } else {
  //     // const stores = await this.adminStoreService.findByCondition({storeId: user.id});
  //     const stores = await this.adminStoreService.findByCondition({
  //       owners: [user.id],
  //     });
  //     return new StoreResponseMapper().mapArray(stores);
  //   }


  // }

  @Get(':id')
  @ApiOperation({ summary: 'Get admin detail' })
  @ApiResponse({ status: 200, type: StoreResponseDto })
  async getAdmin(
    @CurrentUser() _: UserResponseDto,
    @Param('id') storeId: string,
  ): Promise<UserEntity | null> {
    const store = await this.adminAdminService.findById(storeId);
    if (!store) {
      return null;
    }
    return store;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiResponse({ status: 201, type: StoreResponseDto })
  async createAdmin(
    @CurrentUser() user: UserResponseDto,
    @Body() storeCreationDto: StoreCreationDto,
  ): Promise<UserEntity> {
    // const storeOwner = this.userService.createUser({
    //   email: storeCreationDto.email,
    //   password: storeCreationDto.password,
    //   phone: storeCreationDto.primaryPhone
    // });
    const exsistEmail = await this.adminUserService.findByEmail(storeCreationDto.email);
    if (exsistEmail) {
      throw new ConflictException('User with provided email already exists');
    }

    const _user = await this.adminAdminService.create(storeCreationDto, user.id);

    // await this.adminAdminService.createOwner(store, {
    //   firstName: '',
    //   lastName: '',
    //   email: storeCreationDto.email,
    //   phone: storeCreationDto.primaryPhone ?? '',
    //   isActive: storeCreationDto.isActive,
    //   password: storeCreationDto.password
    // });

    return _user;
  }

  // @Post(':storeId/owners')
  // @ApiOperation({ summary: 'Create store owner' })
  // @ApiResponse({ status: 201, type: StoreResponseDto })
  // async createStoreOwner(
  //   @CurrentUser() user: UserResponseDto,
  //   @Param('storeId') storeId: string,
  //   @Body() storeOwnerDto: StoreOwnerCreationDto,
  // ): Promise<StoreResponseDto> {
  //   const owner = await this.adminUserService.findByEmail(storeOwnerDto.email);
  //   if (owner) {
  //     throw new ConflictException('User with provided email already exists');
  //   }

  //   const store = await this.adminAdminService.findById(storeId);
  //   if (!store) {
  //     throw new GoneException('Store not found');
  //   }
  //   await this.adminAdminService.createOwner(store, storeOwnerDto);
  //   return new StoreResponseMapper().map(store);
  // }

  @Put(':id')
  @ApiOperation({ summary: 'Update a store' })
  @ApiResponse({ status: 200, type: StoreResponseDto })
  async updateStore(
    @CurrentUser() user: UserResponseDto,
    @Param('id') id: string,
    @Body() updateStoreDto: StoreUpdatingDto,
  ): Promise<UserEntity> {
    const _store = await this.adminAdminService.findById(id);

    if (updateStoreDto.email) {
      const exsistEmail = await this.adminUserService.findByEmail(updateStoreDto.email);
      if (exsistEmail) {
        if (exsistEmail.id != id) {
          throw new ConflictException('User with provided email already exists');
        }
      }
    }

    const store = await this.adminAdminService.update(id, {
      email: updateStoreDto.email ?? (_store?.email ?? ""),
      lastName: updateStoreDto.name ?? (_store?.lastName ?? ""),

      // primaryPhone: updateStoreDto.primaryPhone ?? (_store?.primaryPhone ?? ""),
      status: updateStoreDto.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE,
      updatedBy: user.id,
    });

    return store;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Inactive a store' })
  @ApiResponse({ status: 200 })
  async deleteStore(@Param('id') id: string): Promise<void> {
    return this.adminAdminService.softDelete(id);
  }
}
