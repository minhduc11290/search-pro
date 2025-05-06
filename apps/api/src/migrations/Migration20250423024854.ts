import { Migration } from '@mikro-orm/migrations';

export class Migration20250423024854 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "stores" alter column "type" type text using ("type"::text);`);

    this.addSql(`alter table "stores" alter column "type" type varchar(255) using ("type"::varchar(255));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "stores" alter column "type" drop default;`);
    this.addSql(`alter table "stores" alter column "type" type uuid using ("type"::text::uuid);`);
  }

}
