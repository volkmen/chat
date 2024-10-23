import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1729580554910 implements MigrationInterface {
    name = 'Init1729580554910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "account_entity" ("id" SERIAL NOT NULL, "username" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "emailToken" integer NOT NULL, "crsfToken" character varying(255), "is_verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_976e2c858e9f73f9d33c7a0408e" UNIQUE ("email"), CONSTRAINT "PK_b482dad15becff9a89ad707dcbe" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "account_entity"`);
    }

}
