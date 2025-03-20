import { Migration } from '@mikro-orm/migrations';

export class Migration20250201043208 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "store_location_searchable" ("id" uuid not null, "created_by" uuid null, "updated_by" uuid null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "location_id" uuid null, "zip_code" varchar(100) not null, constraint "store_location_searchable_pkey" primary key ("id"));`);

    this.addSql(`alter table "store_location_searchable" add constraint "store_location_searchable_location_id_foreign" foreign key ("location_id") references "locations" ("id") on update cascade on delete set null;`);

    // this.addSql(`alter table "roles" drop constraint if exists "roles_role_check";`);

    // this.addSql(`alter table "roles" add constraint "roles_role_check" check("role" in ('SUPER_ADMIN', 'STORE_OWNER', 'APP_USER', 'ADMIN'));`);

    // this.addSql(`alter table "quotes" alter column "requestor" drop default;`);
    // this.addSql(`alter table "quotes" alter column "requestor" type uuid using ("requestor"::text::uuid);`);
    // this.addSql(`alter table "quotes" alter column "requestor" set not null;`);

    this.addSql(`alter table "locations" add column "address_line1" varchar(1000) null, add column "address_line2" varchar(1000) null, add column "city" varchar(1000) null, add column "fax" varchar(100) null, add column "is_open_mon" boolean null, add column "open_time_mon" varchar(100) null, add column "close_time_mon" varchar(100) null, add column "is_open_tue" boolean null, add column "open_time_tue" varchar(100) null, add column "close_time_tue" varchar(100) null, add column "is_open_wed" boolean null, add column "open_time_wed" varchar(100) null, add column "close_time_wed" varchar(100) null, add column "is_open_thu" boolean null, add column "open_time_thu" varchar(100) null, add column "close_time_thu" varchar(100) null, add column "is_open_fri" boolean null, add column "open_time_fri" varchar(100) null, add column "close_time_fri" varchar(100) null, add column "is_open_sat" boolean null, add column "open_time_sat" varchar(100) null, add column "close_time_sat" varchar(100) null, add column "is_open_sun" boolean null, add column "open_time_sun" varchar(100) null, add column "close_time_sun" varchar(100) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "store_location_searchable" cascade;`);

    // this.addSql(`alter table "roles" drop constraint if exists "roles_role_check";`);

    // this.addSql(`alter table "roles" add constraint "roles_role_check" check("role" in ('SUPER_ADMIN', 'ADMIN', 'STORE_OWNER', 'APP_USER'));`);

    // this.addSql(`alter table "quotes" alter column "requestor" drop default;`);
    // this.addSql(`alter table "quotes" alter column "requestor" type uuid using ("requestor"::text::uuid);`);
    // this.addSql(`alter table "quotes" alter column "requestor" drop not null;`);

    this.addSql(`alter table "locations" drop column "address_line1", drop column "address_line2", drop column "city", drop column "fax", drop column "is_open_mon", drop column "open_time_mon", drop column "close_time_mon", drop column "is_open_tue", drop column "open_time_tue", drop column "close_time_tue", drop column "is_open_wed", drop column "open_time_wed", drop column "close_time_wed", drop column "is_open_thu", drop column "open_time_thu", drop column "close_time_thu", drop column "is_open_fri", drop column "open_time_fri", drop column "close_time_fri", drop column "is_open_sat", drop column "open_time_sat", drop column "close_time_sat", drop column "is_open_sun", drop column "open_time_sun", drop column "close_time_sun";`);
  }

}
