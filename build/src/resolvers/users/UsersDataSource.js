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
const typeorm_1 = require("typeorm");
const User_entity_1 = require("entities/User.entity");
const errors_1 = require("utils/errors");
class UsersDataSource {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
    }
    get repository() {
        return this.dbConnection.getRepository(User_entity_1.UserEntity);
    }
    getUserById(id, fieldsMap) {
        return __awaiter(this, void 0, void 0, function* () {
            const includeChats = fieldsMap['chats'] === true;
            const User = yield this.repository.findOne({ where: { id }, relations: { chats: includeChats } });
            if (!User) {
                throw new errors_1.UnAuthorisedError('Unauthorised');
            }
            return User;
        });
    }
    getUsers(userId, fieldsMap) {
        const includeChats = fieldsMap['chats'] === true;
        return this.repository.find({
            relations: {
                chats: includeChats
            },
            where: {
                id: (0, typeorm_1.Not)(userId)
            }
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const User = yield this.repository.findOneBy({ id });
            yield this.repository.remove(User);
            return id;
        });
    }
    updateUser(id, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.update({ id }, changes);
            return this.repository.findOneBy({ id });
        });
    }
}
exports.default = UsersDataSource;
