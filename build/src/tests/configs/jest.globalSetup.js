var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { faker } = require('@faker-js/faker');
const { connectToDatabase } = require('../../services/typeorm');
const { UserEntity } = require('../../entities/User.entity');
module.exports = function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('GLOBAL SETUP START...');
        const dataSource = yield connectToDatabase({
            database: 'test',
            synchronize: true,
            dropSchema: true
        });
        console.log('Successfully connected to database');
        const userData = {
            username: faker.internet.username(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            email_token: 1
        };
        const result = yield dataSource.manager.createQueryBuilder().insert().into(UserEntity).values(userData).execute();
        console.log('Successfully added default user', result.identifiers[0]);
        yield dataSource.close();
        console.log('GLOBAL SETUP END...');
    });
};
