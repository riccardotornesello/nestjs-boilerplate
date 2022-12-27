import { Migration } from '@mikro-orm/migrations';

export class Migration20221227184940 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "email_verification" alter column "verified_at" type timestamptz(0) using ("verified_at"::timestamptz(0));',
    );
    this.addSql(
      'alter table "email_verification" alter column "verified_at" drop not null;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "email_verification" alter column "verified_at" type timestamptz(0) using ("verified_at"::timestamptz(0));',
    );
    this.addSql(
      'alter table "email_verification" alter column "verified_at" set not null;',
    );
  }
}
