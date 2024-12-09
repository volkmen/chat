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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_entity_1 = require("entities/User.entity");
const bcrypt_1 = __importDefault(require("bcrypt"));
const node_util_1 = require("node:util");
const errors_1 = require("utils/errors");
const genSalt = (0, node_util_1.promisify)(bcrypt_1.default.genSalt);
const genHash = (0, node_util_1.promisify)(bcrypt_1.default.hash);
const comparePassword = (0, node_util_1.promisify)(bcrypt_1.default.compare);
class AuthDataSource {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
    }
    get repository() {
        return this.dbConnection.getRepository(User_entity_1.UserEntity);
    }
    signIn(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            const userEntity = yield this.repository.findOne({ where: { email } });
            if (!userEntity) {
                throw new errors_1.UnAuthorisedError('User or password invalid');
            }
            try {
                const result = yield comparePassword(password, userEntity.password);
                if (result) {
                    return userEntity;
                }
                else {
                    throw new errors_1.UnAuthorisedError('User or password invalid');
                }
            }
            catch (error) {
                throw new errors_1.UnAuthorisedError('User or password invalid');
            }
        });
    }
    signUp(userEntity) {
        return __awaiter(this, void 0, void 0, function* () {
            const existedUserEntity = yield this.repository.findBy({ email: userEntity.email });
            if (!existedUserEntity) {
                throw new errors_1.BadRequestError('Such user exist');
            }
            const email_token = Math.floor(Math.random() * 10000);
            const salt = yield genSalt(5);
            userEntity.password = yield genHash(userEntity.password, salt);
            userEntity.email_token = email_token;
            yield this.repository.insert(userEntity);
            return userEntity;
        });
    }
    verifyEmail(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userEntity = yield this.repository.findOneBy({ id });
            if (userEntity && userEntity.email_token === token) {
                yield this.repository.update({ id }, { is_verified: true });
                return this.repository.findOneBy({ id });
            }
            throw new errors_1.BadRequestError('wrong token');
        });
    }
    updateEmailToken(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const email_token = Math.floor(Math.random() * 10000);
            yield this.repository.update({ id }, { email_token });
            return this.repository.findOneBy({ id });
        });
    }
}
exports.default = AuthDataSource;
