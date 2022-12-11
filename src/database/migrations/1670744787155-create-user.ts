import { MigrationInterface, QueryRunner } from "typeorm";

export class createUser1670744787155 implements MigrationInterface {
    name = 'createUser1670744787155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "username" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth_token" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "tokenHash" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_4572ff5d1264c4a523f01aa86a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "auth_token" ADD CONSTRAINT "FK_5a326267f11b44c0d62526bc718" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_token" DROP CONSTRAINT "FK_5a326267f11b44c0d62526bc718"`);
        await queryRunner.query(`DROP TABLE "auth_token"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
