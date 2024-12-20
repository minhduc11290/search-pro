import { Migration } from '@mikro-orm/migrations';

export class Migration20241220042541 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" add column "pw" varchar(100) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" drop column "pw";`);
  }

}
