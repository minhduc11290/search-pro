import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Put,
  ConflictException
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '~/decorators';
import { RolesGuard } from '~/decorators/role-guard.decorator';
import { ProductCreationEntityMapper } from '~/mappers/entities/ProductCreationEntityMapper';
import { ProductResponseMapper } from '~/mappers/responses/ProductResponseMapper';
import { JwtGuard } from '~/modules/share/auth/guard';
import { ProductResponseDto } from '~/share/dtos';
import { AttachmentDto, ProductCreationDto, ProductUpdateDto } from '~/share/dtos/product-creation.dto';
import { LocationPriceDto, MinLocationDto, ProductLocationResponseDto } from '~/share/dtos/product-location-response.dto';
import { UserResponseDto } from '~/share/dtos/user-response.dto';
import { ProductLocationResponseMapper } from '../../../mappers/responses/ProductLocationResponseMapper';
import { AdminProductService } from './admin-product.service';
import { ProductUpdateEntityMapper } from '~/mappers/entities/ProductUpdateEntityMapper';
import { AttachmentEntity } from '~/entities';

@ApiTags('System - Products')
@Controller('admin')
@RolesGuard('SUPER_ADMIN')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class AdminProductController {
  constructor(private readonly adminProductService: AdminProductService) { }

  @Get('/stores/:storeId/products')
  @ApiOperation({ summary: 'Get products by store' })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  async getProductsByStore(
    @Param('storeId') storeId: string,
  ): Promise<ProductResponseDto[]> {
    // const productLocations =
    //   await this.adminProductService.findByStore(storeId);
    // return new ProductLocationResponseMapper().mapArray(productLocations);
    const products = await this.adminProductService.findProductByStore(storeId);
    return new ProductResponseMapper().mapArray(products);
  }



  //TODO:
  @Post('/stores/:storeId/products')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, type: ProductCreationDto })
  async create(
    @Param('storeId') storeId: string,
    @CurrentUser() user: UserResponseDto,
    @Body() locationCreationDto: ProductCreationDto,
  ): Promise<ProductResponseDto> {
    if (locationCreationDto.sku) {
      const _exsistProduct = await this.adminProductService.findByStoreSku(storeId, locationCreationDto.sku);
      if (_exsistProduct) {
        throw new ConflictException('sku already exists');
      }
    }


    const creationData = new ProductCreationEntityMapper().map(
      locationCreationDto,
      { storeId, createdBy: user.id },
    );
    const product = await this.adminProductService.create(
      creationData,
      locationCreationDto.productLocations,
      locationCreationDto.attachments
    );
    const updatedProduct = await this.adminProductService.findProductById(
      product.id,
    );
    return new ProductResponseMapper().map(updatedProduct);
  }


  @Put('/products/:productId')
  @ApiOperation({ summary: 'Update an product' })
  @ApiResponse({ status: 201, type: ProductCreationDto })
  async update(
    @Param('productId') productId: string,
    @CurrentUser() user: UserResponseDto,
    @Body() productUpdateDto: ProductUpdateDto,
  ): Promise<ProductResponseDto> {
    const _productEntity = await this.adminProductService.findProductById(productId
    );

    if (productUpdateDto.sku) {
      const _exsistProduct = await this.adminProductService.findByStoreSku(_productEntity.store.id, productUpdateDto.sku);
      if (_exsistProduct && _exsistProduct.id != _productEntity.id) {
        throw new ConflictException('sku already exists');
      }
    }

    const updateData = new ProductUpdateEntityMapper().map(
      productUpdateDto,
      { updateBy: user.id, product: _productEntity },
    );


    const product = await this.adminProductService.update(
      productId,
      updateData,
      // locationCreationDto.productLocations,
      // locationCreationDto.attachments
    );

    const updatedProduct = await this.adminProductService.findProductById(
      product.id,
    );
    return new ProductResponseMapper().map(updatedProduct);
  }

  @Delete('/products/:productId')
  @ApiOperation({ summary: 'Delete a product in a location' })
  @ApiResponse({ status: 200 })
  async deleteLocation(
    @Param('productId') productId: string,
  ): Promise<void> {
    return this.adminProductService.deleteProduct(
      productId
    );
  }

  @Post('/products/:productId/locations')
  @ApiOperation({ summary: 'Add a product in a location' })
  @ApiResponse({ status: 200 })
  async addProductLocation(
    @Param('productId') productId: string,
    @Body() location: LocationPriceDto,
  ): Promise<void> {
    console.log("/products/:productId/locations");
    console.log("location", location);
    return this.adminProductService.addProductLocation(
      productId,
      location
    );
  }

  @Put('/products/locations/:locationId')
  @ApiOperation({ summary: 'Update Location to product' })
  @ApiResponse({ status: 200 })
  async updateProductLocation(
    // @Param('productId') productId: string,
    @Param('locationId') locationId: string,
    @Body() location: LocationPriceDto,
  ): Promise<void> {
    console.log("location", location);
    return this.adminProductService.updateProductLocation(
      // productId,
      locationId,
      location
    );
  }


  @Post('products/:productId/attachment')
  @ApiOperation({ summary: 'Add an attachments product' })
  @ApiResponse({ status: 200, type: ProductCreationDto })
  async addAttachment(
    @Param('productId') productId: string,
    @Body() attachments: AttachmentDto[],
  ): Promise<AttachmentEntity[]> {
    return this.adminProductService.addAttachment(
      productId,
      attachments
    );

  }

  @Delete('/attachment/:attachmentId')
  @ApiOperation({ summary: 'Delete an attachments product' })
  @ApiResponse({ status: 200, type: ProductCreationDto })
  async deleteAttachment(
    @Param('attachmentId') attachmentId: string,
  ): Promise<void> {
    return this.adminProductService.deleteAttachment(
      attachmentId
    );

  }

  @Delete('/products/locations/:locationId')
  @ApiOperation({ summary: 'Delete an attachments product' })
  @ApiResponse({ status: 200, type: ProductCreationDto })
  async deleteLocations(
    @Param('locationId') locationId: string,
  ): Promise<void> {

    return this.adminProductService.deleteLocation(
      locationId
    );

  }



}
