import { Migration } from '@mikro-orm/migrations';

export class Migration20250402125323 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "locations" add column "cities" jsonb null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "locations" drop column "cities";`);
  }

}
