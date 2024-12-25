import { Migration } from '@mikro-orm/migrations';

export class Migration20241216024304 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "locations" add column "phone" varchar(100) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "locations" drop column "phone";`);
  }

}
