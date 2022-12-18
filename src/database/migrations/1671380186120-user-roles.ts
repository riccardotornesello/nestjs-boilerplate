import { MigrationInterface, QueryRunner } from 'typeorm';

export class userRoles1671380186120 implements MigrationInterface {
  name = 'userRoles1671380186120';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'SUPPORT', 'USER')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL DEFAULT 'USER'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_permissions_enum" AS ENUM('GET_USERS')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "permissions" "public"."user_permissions_enum" array NOT NULL DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "permissions"`);
    await queryRunner.query(`DROP TYPE "public"."user_permissions_enum"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
  }
}
