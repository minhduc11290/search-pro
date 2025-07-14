import { FilterQuery } from '@mikro-orm/core';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AttachmentEntity, ProductLocationEntity } from '~/entities';
import { ProductLocationResponseMapper } from '~/mappers/responses/ProductLocationResponseMapper';
import { PaginationResponseData, ProductFilterDto } from '~/share/dtos';
import { ProductLocationResponseDto } from '~/share/dtos/product-location-response.dto';
import { GeoRefService } from '../share/geo-ref/geo-ref.service';
import { ProductService } from './product.service';
import { ProductDetailFilterDto } from '~/share/dtos/product-detail-filter.dto';
import { ProductStatus } from '~/share/consts/enums';
import { ProductNewFilterDto } from '~/share/dtos/product-new-filter.dto';
import { latLngToCell, gridDistance, getResolution, gridDisk } from 'h3-js';
import { KeywordFilterDto } from '~/share/dtos/keyword-filter.dto';

@ApiTags('App - Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly geoRefService: GeoRefService,
  ) { }

  @Get()
  @ApiOperation({ summary: 'List products' })
  @ApiResponse({
    status: 200,
    type: ProductLocationResponseDto // PaginationResponseData<ProductLocationResponseDto>,
  })
  async searchProducts(
    @Query() query: ProductFilterDto,
  ): Promise<ProductLocationResponseDto[]> {
    const geoRef = await this.geoRefService.findOneByZipCodeAndSteName(
      query.zipCode,
      query.steName,
    );
    console.log("geo", geoRef)

    const conditions: FilterQuery<ProductLocationEntity> = {
      location: {
        geoRef: geoRef,
      },
    };

    if (query.productName) {
      conditions.product = {
        name: { $ilike: `%${query.productName}%` },
        status: ProductStatus.ACTIVE
      };
    } else {
      conditions.product = {
        status: ProductStatus.ACTIVE
      };
    }
    console.log("conditions", conditions)
    // const { page = 1, limit = 10 } = query;
    const productLocations = await this.productService.findByCondition(
      conditions
      // { page, limit },
    );
    const categories = await this.productService.findAllCategory()
    productLocations.map((product) => {
      if (product.product.attachments.length == 0) {
        let cate = categories.find((cat) => cat.id == product.product.store.categoryId);
        if (cate) {
          product.product.attachments.add({
            id: cate.id,
            name: cate.productUrl ?? "",
            type: cate.productUrl ?? "",
            url: cate.productUrl ?? "",
          });
        }
      }
    })

    console.log("productLocations", productLocations)
    const data = new ProductLocationResponseMapper().mapArray(productLocations);
    // return { data, page, limit };
    return data;
  }

  @Get("keywords")
  @ApiOperation({ summary: 'List products' })
  @ApiResponse({
    status: 200,
    type: ProductLocationResponseDto // PaginationResponseData<ProductLocationResponseDto>,
  })
  async searchKeyWordProducts(
    @Query() query: KeywordFilterDto,
  ): Promise<String[]> {


    const conditions: FilterQuery<ProductLocationEntity> = {

    };

    if (query.productName) {
      conditions.product = {
        name: { $ilike: `%${query.productName}%` },
        status: ProductStatus.ACTIVE
      };
    } else {
      return [];
    }

    // const { page = 1, limit = 10 } = query;
    const page = 1;
    const limit = 10;
    const productLocations = await this.productService.findByConditionWithPagination(
      conditions,
      { page, limit },
    );

    console.log("productLocations", productLocations)
    // const data = new ProductLocationResponseMapper().mapArray(productLocations);
    // return { data, page, limit };
    return productLocations.map((p) => p.product.name);
  }

  @Get("search-new")
  @ApiOperation({ summary: 'List products' })
  @ApiResponse({
    status: 200,
    type: ProductLocationResponseDto // PaginationResponseData<ProductLocationResponseDto>,
  })
  async searchNewProducts(
    @Query() query: ProductNewFilterDto,
  ): Promise<ProductLocationResponseDto[]> {
    // const geoRef = await this.geoRefService.findOneByZipCodeAndSteName(
    //   query.zipCode,
    //   query.steName,
    // );
    // console.log("geo", geoRef)

    const conditions: FilterQuery<ProductLocationEntity> = {
      // location: {
      //   // geoRef: geoRef,
      // },
    };
    // if ()
    if (query.typeProduct == "SERVICE" || query.typeProduct == "RETAIL") {


      if (query.typeSearch == "around") {
        // Case get product around
        if (query.typeProduct == "SERVICE") {
          const stores = await this.productService.getLocationSearchable(query.state!, query.city!);
          conditions.location = {
            store: {
              id: { $in: stores.map((s) => s.store.id) }
            }

          };
        } else {
          if (query.distance != "all") {

            const centerH3 = latLngToCell(query.lat!, query.lng!, 7);
            const maxDistanceMiles = Number(query.distance ?? "0");

            const k = this.productService.milesToH3Ring(maxDistanceMiles);
            const h3List = await this.productService.getAllLocation();
            const neighbors = new Set(gridDisk(centerH3, k));

            const filtered = h3List.filter((hex) => {
              // if (!hex.h3Index) return false;
              // console.log("centerH3", centerH3);
              // console.log("hex.h3Index", hex.h3Index);
              // console.log("centerH3-2", getResolution(centerH3));
              // console.log("centerH3-2", getResolution(hex.h3Index));
              // try {
              //   const dist = gridDistance(centerH3, hex.h3Index);
              //   console.log("dist", dist);
              //   return dist !== -1 && dist <= k;
              // } catch (e) {
              //   console.error("Error calculating distance:", e);
              //   return false;
              // }
              // const neighbors = new Set(gridDisk(centerH3, k));
              return hex.h3Index && neighbors.has(hex.h3Index)
            });
            console.log("filtered", filtered);

            conditions.location = {
              h3Index: { $in: filtered.map((l) => l.h3Index!) },

            };
          } else {

          }
        }
      } else if (query.typeSearch == "another") {
        const stores = await this.productService.getLocationSearchable(query.state!, query.city!);
        conditions.location = {
          store: {
            id: { $in: stores.map((s) => s.store.id) }
          }

        };
      }

      if (query.productName) {
        conditions.product = {
          name: { $ilike: `%${query.productName}%` },
          status: ProductStatus.ACTIVE,
          store: {
            type: query.typeProduct
          }
        }
      } else {
        conditions.product = {
          status: ProductStatus.ACTIVE,
          store: {
            type: query.typeProduct
          }
        };

      }

      // const { page = 1, limit = 10 } = query;
      const productLocations = await this.productService.findByCondition(
        conditions
        // { page, limit },
      );
      const categories = await this.productService.findAllCategory()
      productLocations.map((product) => {
        if (product.product.attachments.length == 0) {
          let cate = categories.find((cat) => cat.id == product.product.store.categoryId);
          if (cate) {
            const attachment = new AttachmentEntity();
            attachment.id = cate.id; // gán thủ công, chú ý nếu id là UUID cần chính xác
            attachment.name = cate.productUrl ?? "no-image.png";
            attachment.type = cate.productUrl ?? "no-image.png";
            attachment.url = cate.productUrl ?? "no-image.png";
            product.product.attachments.add(attachment);
          }
        }
      })

      const data = new ProductLocationResponseMapper().mapArray(productLocations);

      // return { data, page, limit };
      return data;
    } else {
      return new ProductLocationResponseMapper().mapArray([]);
    }
  }

  @Get(':productLocationId')
  @ApiOperation({ summary: 'Product detail by location' })
  @ApiResponse({ status: 200, type: ProductLocationResponseDto })
  async getProduct(
    @Param('productLocationId') productLocationId: string,
    @Query() query: ProductDetailFilterDto,
  ): Promise<ProductLocationResponseDto | null> {
    // const geoRef = await this.geoRefService.findOneByZipCodeAndSteName(
    //   query.zipCode,
    //   query.steName,
    // );
    const conditions: FilterQuery<ProductLocationEntity> = {
      // location: {
      //   geoRef: geoRef?.id,
      // },
      id: productLocationId,
    };
    const product = await this.productService.findByProductLocationId(conditions);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const categories = await this.productService.findAllCategory()

    if (product.product.attachments.length == 0) {
      let cate = categories.find((cat) => cat.id == product.product.store.categoryId);
      if (cate) {
        const attachment = new AttachmentEntity();
        attachment.id = cate.id; // gán thủ công, chú ý nếu id là UUID cần chính xác
        attachment.name = cate.productUrl ?? "no-image.png";
        attachment.type = cate.productUrl ?? "no-image.png";
        attachment.url = cate.productUrl ?? "no-image.png";
        product.product.attachments.add(attachment);
      }
    }

    return new ProductLocationResponseMapper().map(product);
  }




}
