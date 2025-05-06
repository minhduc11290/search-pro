import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CustomGuard } from '~/decorators/custom-guard.decorator';
import TokenService from '../share/auth/token.service';
import { OrmModule } from '../share/orm/orm.module';
import { AdminStoreController } from './store/admin-store.controller';
import { AdminStoreModule } from './store/admin-store.module';
import { AdminUserController } from './user/admin-user.controller';
import { AdminUserModule } from './user/admin-user.module';
import AdminUserService from './user/admin-user.service';
import { AdminStoreService } from './store/admin-store.service';
import { AdminLocationModule } from './location/admin-location.module';
import { AdminLocationController } from './location/admin-location.controller';
import { AdminLocationService } from './location/admin-location.service';
import { AdminProductModule } from './product/admin-product.module';
import { AdminProductController } from './product/admin-product.controller';
import { AdminProductService } from './product/admin-product.service';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import UsersService from './users/users.service';
import { GeoRefService } from '../share/geo-ref/geo-ref.service';
import { FileController } from './file/file.controller';
import { FileModule } from './file/file.module';
import { AdminAdminModule } from './admin/admin.module';
import { AdminAdminController } from './admin/admin.controller';
import { AdminAdminService } from './admin/admin.service';
import { AdminLocationSearchableModule } from './location-searchable/admin-location-searchable.module';
import { AdminLocationSearchableController } from './location-searchable/admin-location-searchable.controller';
import { AdminLocationSearchableService } from './location-searchable/admin-location-searchable.service';
import { CategoriesModule } from './categories/categories.module';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';

@Module({
  imports: [
    OrmModule,
    AdminUserModule,
    UsersModule,
    AdminStoreModule,
    AdminLocationModule,
    AdminProductModule,
    ConfigModule.forRoot({ isGlobal: true }),
    FileModule,
    AdminAdminModule,
    AdminLocationSearchableModule,
    CategoriesModule
  ],
  controllers: [
    AdminUserController,
    AdminStoreController,
    AdminLocationController,
    AdminProductController,
    UsersController,
    FileController,
    AdminAdminController,
    AdminLocationSearchableController,
    CategoriesController
  ],
  providers: [
    TokenService,
    CustomGuard,
    JwtService,
    AdminUserService,
    AdminStoreService,
    AdminLocationService,
    AdminProductService,
    UsersService,
    GeoRefService,
    AdminAdminService,
    AdminLocationSearchableService,
    CategoriesService

  ],
})
export class AdminModule { }
