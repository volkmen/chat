"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Init1732369412708 = void 0;
class Init1732369412708 {
    constructor() {
        this.name = 'Init1732369412708';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "Messages" ("id" SERIAL NOT NULL, "content" character varying(10000) NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "chatId" integer, "ownerId" integer, CONSTRAINT "PK_ecc722506c4b974388431745e8b" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "Chats" ("id" SERIAL NOT NULL, "is_group" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_64c36c2b8d86a0d5de4cf64de8d" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "username" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "email_token" integer NOT NULL, "is_verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "UsersChats" ("usersId" integer NOT NULL, "chatsId" integer NOT NULL, CONSTRAINT "PK_5f0387fac37e6806f4e283f4c0b" PRIMARY KEY ("usersId", "chatsId"))`);
            yield queryRunner.query(`CREATE INDEX "IDX_ada2fd10e02bd8ce8d044ee2f7" ON "UsersChats" ("usersId") `);
            yield queryRunner.query(`CREATE INDEX "IDX_924447f6717352164afda21e82" ON "UsersChats" ("chatsId") `);
            yield queryRunner.query(`ALTER TABLE "Messages" ADD CONSTRAINT "FK_919cc5bc35e27c3c61643fd835e" FOREIGN KEY ("chatId") REFERENCES "Chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "Messages" ADD CONSTRAINT "FK_b12fd5b5c9a4672bb2a88ffbb75" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "UsersChats" ADD CONSTRAINT "FK_ada2fd10e02bd8ce8d044ee2f7a" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE "UsersChats" ADD CONSTRAINT "FK_924447f6717352164afda21e82c" FOREIGN KEY ("chatsId") REFERENCES "Chats"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "UsersChats" DROP CONSTRAINT "FK_924447f6717352164afda21e82c"`);
            yield queryRunner.query(`ALTER TABLE "UsersChats" DROP CONSTRAINT "FK_ada2fd10e02bd8ce8d044ee2f7a"`);
            yield queryRunner.query(`ALTER TABLE "Messages" DROP CONSTRAINT "FK_b12fd5b5c9a4672bb2a88ffbb75"`);
            yield queryRunner.query(`ALTER TABLE "Messages" DROP CONSTRAINT "FK_919cc5bc35e27c3c61643fd835e"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_924447f6717352164afda21e82"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_ada2fd10e02bd8ce8d044ee2f7"`);
            yield queryRunner.query(`DROP TABLE "UsersChats"`);
            yield queryRunner.query(`DROP TABLE "Users"`);
            yield queryRunner.query(`DROP TABLE "Chats"`);
            yield queryRunner.query(`DROP TABLE "Messages"`);
        });
    }
}
exports.Init1732369412708 = Init1732369412708;
