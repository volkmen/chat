import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1730907543950 implements MigrationInterface {
    name = 'Init1730907543950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "username" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "email_token" integer NOT NULL, "is_verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_entity" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "is_group" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_07e65670b36d025a69930ae6f2e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message_entity" ("id" SERIAL NOT NULL, "content" character varying(10000) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "chatId" integer, CONSTRAINT "PK_45bb3707fbb99a73e831fee41e0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chat_entity" ADD CONSTRAINT "FK_5ceb65fa0fa5268aa12e689785e" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message_entity" ADD CONSTRAINT "FK_ed96c9fd7ed83ee4ec5c286e3b9" FOREIGN KEY ("chatId") REFERENCES "chat_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message_entity" DROP CONSTRAINT "FK_ed96c9fd7ed83ee4ec5c286e3b9"`);
        await queryRunner.query(`ALTER TABLE "chat_entity" DROP CONSTRAINT "FK_5ceb65fa0fa5268aa12e689785e"`);
        await queryRunner.query(`DROP TABLE "message_entity"`);
        await queryRunner.query(`DROP TABLE "chat_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
    }

}
