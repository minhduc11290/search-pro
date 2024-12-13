import { Migration } from '@mikro-orm/migrations';

export class Migration20241211144017 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "products" drop constraint "products_sku_unique";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "products" add constraint "products_sku_unique" unique ("sku");`);
  }

}
