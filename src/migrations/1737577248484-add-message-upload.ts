import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMessageUpload1737577248484 implements MigrationInterface {
  name = 'AddMessageUpload1737577248484';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "MessageUploads" ("id" SERIAL NOT NULL, "contentType" character varying(30) NOT NULL, "url" character varying(100) NOT NULL, "fileName" character varying(30) NOT NULL, "size" bigint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "messageId" integer, CONSTRAINT "PK_ff9c7a62b5718ab6ba942247ce5" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "MessageUploads" ADD CONSTRAINT "FK_5d1cba891ffff64c58c8ff824f2" FOREIGN KEY ("messageId") REFERENCES "Messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "MessageUploads" DROP CONSTRAINT "FK_5d1cba891ffff64c58c8ff824f2"`);
    await queryRunner.query(`DROP TABLE "MessageUploads"`);
  }
}
