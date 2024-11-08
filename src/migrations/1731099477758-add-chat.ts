import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChat1731099477758 implements MigrationInterface {
    name = 'AddChat1731099477758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_entity" DROP CONSTRAINT "FK_5ceb65fa0fa5268aa12e689785e"`);
        await queryRunner.query(`CREATE TABLE "public_key_entity" ("id" BIGSERIAL NOT NULL, "publicKey" character varying(2048) NOT NULL, "chatId" integer, "userId" integer, CONSTRAINT "PK_a7d43f263003431c0c83381706e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_entity_chats_chat_entity" ("userEntityId" integer NOT NULL, "chatEntityId" integer NOT NULL, CONSTRAINT "PK_dac5cd628302ec2a66471f1cb7b" PRIMARY KEY ("userEntityId", "chatEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b940d8d62503a3359ab2726619" ON "user_entity_chats_chat_entity" ("userEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8eb19fad2c2b22c1235509c482" ON "user_entity_chats_chat_entity" ("chatEntityId") `);
        await queryRunner.query(`ALTER TABLE "chat_entity" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "message_entity" ADD "is_read" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "message_entity" ADD "ownerId" integer`);
        await queryRunner.query(`ALTER TABLE "message_entity" ADD CONSTRAINT "FK_9264c16c65a7ef8e0878174b3a4" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public_key_entity" ADD CONSTRAINT "FK_04fb06ed191f6fc86ded8fdc3ba" FOREIGN KEY ("chatId") REFERENCES "chat_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public_key_entity" ADD CONSTRAINT "FK_ea18b67b8db4fe7832c98e0567d" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_entity_chats_chat_entity" ADD CONSTRAINT "FK_b940d8d62503a3359ab27266195" FOREIGN KEY ("userEntityId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_entity_chats_chat_entity" ADD CONSTRAINT "FK_8eb19fad2c2b22c1235509c4825" FOREIGN KEY ("chatEntityId") REFERENCES "chat_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity_chats_chat_entity" DROP CONSTRAINT "FK_8eb19fad2c2b22c1235509c4825"`);
        await queryRunner.query(`ALTER TABLE "user_entity_chats_chat_entity" DROP CONSTRAINT "FK_b940d8d62503a3359ab27266195"`);
        await queryRunner.query(`ALTER TABLE "public_key_entity" DROP CONSTRAINT "FK_ea18b67b8db4fe7832c98e0567d"`);
        await queryRunner.query(`ALTER TABLE "public_key_entity" DROP CONSTRAINT "FK_04fb06ed191f6fc86ded8fdc3ba"`);
        await queryRunner.query(`ALTER TABLE "message_entity" DROP CONSTRAINT "FK_9264c16c65a7ef8e0878174b3a4"`);
        await queryRunner.query(`ALTER TABLE "message_entity" DROP COLUMN "ownerId"`);
        await queryRunner.query(`ALTER TABLE "message_entity" DROP COLUMN "is_read"`);
        await queryRunner.query(`ALTER TABLE "chat_entity" ADD "userId" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8eb19fad2c2b22c1235509c482"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b940d8d62503a3359ab2726619"`);
        await queryRunner.query(`DROP TABLE "user_entity_chats_chat_entity"`);
        await queryRunner.query(`DROP TABLE "public_key_entity"`);
        await queryRunner.query(`ALTER TABLE "chat_entity" ADD CONSTRAINT "FK_5ceb65fa0fa5268aa12e689785e" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
