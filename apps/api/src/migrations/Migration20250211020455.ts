import { Migration } from '@mikro-orm/migrations';

export class Migration20250211020455 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" drop constraint "users_user_name_unique";`);
    this.addSql(`alter table "users" drop constraint "users_email_unique";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" add constraint "users_user_name_unique" unique ("user_name");`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);
  }

}
