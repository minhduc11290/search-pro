import { Migration } from '@mikro-orm/migrations';

export class Migration20250112100653 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "categories" ("id" uuid not null, "name" varchar(255) not null, constraint "categories_pkey" primary key ("id"));`);

    this.addSql(`alter table "stores" add column "category_id" uuid null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "categories" cascade;`);

    this.addSql(`alter table "stores" drop column "category_id";`);
  }

}
