import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovePbkey1732050191638 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "PbKeys" DROP CONSTRAINT "FK_d12647b38570bda4075921b2731"`);
    await queryRunner.query(`ALTER TABLE "PbKeys" DROP CONSTRAINT "FK_91333f51332f713d5790522fa59"`);
    await queryRunner.query(`DROP TABLE "PbKeys"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "PbKeys" ("id" BIGSERIAL NOT NULL, "publicKey" character varying(2048) NOT NULL, "chatId" integer, "userId" integer, CONSTRAINT "PK_2a3ad50dc62dfc4d0ef639d8feb" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "PbKeys" ADD CONSTRAINT "FK_91333f51332f713d5790522fa59" FOREIGN KEY ("chatId") REFERENCES "Chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "PbKeys" ADD CONSTRAINT "FK_d12647b38570bda4075921b2731" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
