import { Migration } from '@mikro-orm/migrations';

export class Migration20230125103946 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" varchar(255) not null, "email" varchar(255) not null, "password_hash" varchar(255) not null, "is_active" boolean not null default true, "role" text check ("role" in (\'SUPER_ADMIN\', \'ADMIN\', \'SUPPORT\', \'USER\')) not null default \'USER\', "permissions" text[] not null default \'{}\');',
    );
    this.addSql(
      'alter table "user" add constraint "user_username_unique" unique ("username");',
    );
    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");',
    );

    this.addSql(
      'create table "email_verification" ("user_id" int not null, "verified_at" timestamptz(0) null, "last_sent" timestamptz(0) null, constraint "email_verification_pkey" primary key ("user_id"));',
    );

    this.addSql(
      'create table "auth_token" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "token_hash" varchar(255) not null, "user_id" int not null);',
    );

    this.addSql(
      'alter table "email_verification" add constraint "email_verification_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "auth_token" add constraint "auth_token_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "email_verification" drop constraint "email_verification_user_id_foreign";',
    );

    this.addSql(
      'alter table "auth_token" drop constraint "auth_token_user_id_foreign";',
    );

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "email_verification" cascade;');

    this.addSql('drop table if exists "auth_token" cascade;');
  }
}
