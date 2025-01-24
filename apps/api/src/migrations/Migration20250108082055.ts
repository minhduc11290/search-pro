import { Migration } from '@mikro-orm/migrations';

export class Migration20250108082055 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "quotes" drop constraint "quotes_requestor_id_foreign";`);

    // this.addSql(`alter table "quotes" drop column "requestor_id";`);

    // this.addSql(`alter table "quotes" add column "requestor" uuid not null;`);
  }

  override async down(): Promise<void> {
    // this.addSql(`alter table "quotes" drop column "requestor";`);

    // this.addSql(`alter table "quotes" add column "requestor_id" uuid not null;`);
    // this.addSql(`alter table "quotes" add constraint "quotes_requestor_id_foreign" foreign key ("requestor_id") references "users" ("id") on update cascade;`);
  }

}
