import { MigrationInterface, QueryRunner } from 'typeorm';

export class uniqueCols1670746646032 implements MigrationInterface {
  name = 'uniqueCols1670746646032';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth_token" DROP CONSTRAINT "PK_4572ff5d1264c4a523f01aa86a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_token" ADD CONSTRAINT "PK_15011a0899cc2280bf97a502d75" PRIMARY KEY ("id", "tokenHash")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_token" DROP CONSTRAINT "PK_15011a0899cc2280bf97a502d75"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_token" ADD CONSTRAINT "PK_4572ff5d1264c4a523f01aa86a0" PRIMARY KEY ("id")`,
    );
  }
}
