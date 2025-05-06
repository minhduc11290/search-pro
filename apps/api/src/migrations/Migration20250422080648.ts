import { Migration } from '@mikro-orm/migrations';

export class Migration20250422080648 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "stores" add column "type" uuid null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "stores" drop column "type";`);
  }

}
