import { Migration } from '@mikro-orm/migrations';

export class Migration20250203090131 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "locations" add column "latitude" real null, add column "longitude" real null, add column "h3index" varchar(1000) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "locations" drop column "latitude", drop column "longitude", drop column "h3index";`);
  }

}
