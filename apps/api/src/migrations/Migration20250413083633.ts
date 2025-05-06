import { Migration } from '@mikro-orm/migrations';

export class Migration20250413083633 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "categories" add column "product_url" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "categories" drop column "product_url";`);
  }

}
