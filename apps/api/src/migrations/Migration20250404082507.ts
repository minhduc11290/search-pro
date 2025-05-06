import { Migration } from '@mikro-orm/migrations';

export class Migration20250404082507 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "location_searchables" ("id" uuid not null, "created_by" uuid null, "updated_by" uuid null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "store_id" uuid not null, "ste_name" varchar(100) not null, "cities" jsonb null, constraint "location_searchables_pkey" primary key ("id"));`);

    this.addSql(`alter table "location_searchables" add constraint "location_searchables_store_id_foreign" foreign key ("store_id") references "stores" ("id") on update cascade;`);

    this.addSql(`alter table "categories" add column "url" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "location_searchables" cascade;`);

    this.addSql(`alter table "categories" drop column "url";`);
  }

}
