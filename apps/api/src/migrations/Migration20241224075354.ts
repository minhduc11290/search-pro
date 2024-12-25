import { Migration } from '@mikro-orm/migrations';

export class Migration20241224075354 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "quotes" drop constraint "quotes_product_location_id_foreign";`);

    this.addSql(`alter table "products" drop constraint "products_sku_store_id_unique";`);

    this.addSql(`alter table "quotes" drop column "product_location_id";`);

    this.addSql(`alter table "quotes" add column "product_location" int not null, add column "product" int not null, add column "geo_ref" int not null, add column "banner" varchar(255) not null, add column "image" varchar(255) not null, add column "price" real null, add column "sku" varchar(100) null, add column "name" varchar(255) null, add column "description" varchar(1000) null, add column "location_id" int not null, add column "location_name" varchar(255) not null, add column "address" varchar(1000) not null, add column "open_time" varchar(100) null, add column "close_time" varchar(100) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "products" add constraint "products_sku_store_id_unique" unique ("sku", "store_id");`);

    this.addSql(`alter table "quotes" drop column "product_location", drop column "product", drop column "geo_ref", drop column "banner", drop column "image", drop column "price", drop column "sku", drop column "name", drop column "description", drop column "location_id", drop column "location_name", drop column "address", drop column "open_time", drop column "close_time";`);

    this.addSql(`alter table "quotes" add column "product_location_id" uuid not null;`);
    this.addSql(`alter table "quotes" add constraint "quotes_product_location_id_foreign" foreign key ("product_location_id") references "product_locations" ("id") on update cascade;`);
  }

}
