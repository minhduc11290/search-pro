import { Migration } from '@mikro-orm/migrations';

export class Migration20241224080030 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "quotes" alter column "product_location" drop default;`);
    this.addSql(`alter table "quotes" alter column "product_location" type uuid using ("product_location"::text::uuid);`);
    this.addSql(`alter table "quotes" alter column "product" drop default;`);
    this.addSql(`alter table "quotes" alter column "product" type uuid using ("product"::text::uuid);`);
    this.addSql(`alter table "quotes" alter column "geo_ref" drop default;`);
    this.addSql(`alter table "quotes" alter column "geo_ref" type uuid using ("geo_ref"::text::uuid);`);
    this.addSql(`alter table "quotes" alter column "location_id" drop default;`);
    this.addSql(`alter table "quotes" alter column "location_id" type uuid using ("location_id"::text::uuid);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "quotes" alter column "product_location" type text using ("product_location"::text);`);
    this.addSql(`alter table "quotes" alter column "product" type text using ("product"::text);`);
    this.addSql(`alter table "quotes" alter column "geo_ref" type text using ("geo_ref"::text);`);
    this.addSql(`alter table "quotes" alter column "location_id" type text using ("location_id"::text);`);

    this.addSql(`alter table "quotes" alter column "product_location" type int using ("product_location"::int);`);
    this.addSql(`alter table "quotes" alter column "product" type int using ("product"::int);`);
    this.addSql(`alter table "quotes" alter column "geo_ref" type int using ("geo_ref"::int);`);
    this.addSql(`alter table "quotes" alter column "location_id" type int using ("location_id"::int);`);
  }

}
