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
const graphql_1 = require("graphql");
const nodemailer_1 = __importDefault(require("nodemailer"));
const User_entity_1 = require("../entities/User.entity");
const faker_1 = require("@faker-js/faker");
jest.spyOn(nodemailer_1.default, 'createTransport').mockImplementation(() => {
    return {
        sendMail: jest.fn().mockResolvedValue(true)
    };
});
const mockUser = {
    username: faker_1.faker.internet.username(), // before version 9.1.0, use userName()
    email: faker_1.faker.internet.email(),
    password: faker_1.faker.internet.password()
};
let executor;
describe('AUTH apis', () => {
    beforeAll(() => {
        executor = globalThis.defaultUserExecutor;
    });
    it('should SIGN UP', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield globalThis.signedOutExecutor({
            document: (0, graphql_1.parse)(/* GraphQL */ `
        mutation SignUp {
          SignUp(username: "${mockUser.username}", email: "${mockUser.email}", password: "${mockUser.password}") {
            username
            is_verified
            jwtToken
            id
          }
        }
      `),
            operationName: 'SignUp'
        });
        expect(result).toBeDefined();
        expect(result.data).toHaveProperty('SignUp');
        expect(result.data.SignUp).toBeTruthy();
        expect(result.data.SignUp.is_verified).toBeFalsy();
        expect(result.data.SignUp.jwtToken).toBeTruthy();
    }));
    it('should resend verification token', () => __awaiter(void 0, void 0, void 0, function* () {
        const repository = globalThis.dbConnection.getRepository(User_entity_1.UserEntity);
        const user = yield repository.findOneBy({ id: 1 });
        const token = user.email_token;
        const resultVerifyEmail = yield executor({
            document: (0, graphql_1.parse)(/* GraphQL */ `
        query ResendVerificationToken {
          ResendVerificationToken
        }
      `)
        });
        const userUpdated = yield repository.findOneBy({ id: 1 });
        expect(token).not.toEqual(userUpdated.email_token);
        expect(resultVerifyEmail.data.ResendVerificationToken).toBeTruthy();
    }));
    it('should verify email', () => __awaiter(void 0, void 0, void 0, function* () {
        const repository = globalThis.dbConnection.getRepository(User_entity_1.UserEntity);
        const user = yield repository.findOneBy({ id: 1 });
        const token = user.email_token;
        const resultVerifyEmail = yield executor({
            document: (0, graphql_1.parse)(/* GraphQL */ `
          mutation VerifyEmail {
            VerifyEmail(token: ${token}) {
              is_verified
              id
            }
          }
        `)
        });
        expect(resultVerifyEmail.data.VerifyEmail).toBeTruthy();
        expect(resultVerifyEmail.data.VerifyEmail.is_verified).toBeTruthy();
    }));
    it('should NOT signin into this auth if wrong password', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield globalThis.signedOutExecutor({
            document: (0, graphql_1.parse)(/* GraphQL */ `
          mutation SignIn {
            SignIn(email: "${mockUser.email}", password: "wrong password") {
              email
            }
          }
        `)
        });
        expect(result).toBeDefined();
        expect(result.data).toHaveProperty('SignIn');
        expect(result.data.SignIn).toBeFalsy();
    }));
    it('should signin into this auth if correct password', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield globalThis.signedOutExecutor({
            document: (0, graphql_1.parse)(/* GraphQL */ `
          mutation SignIn {
            SignIn(email: "${mockUser.email}", password: "${mockUser.password}") {
              email
            }
          }
        `)
        });
        expect(result).toBeDefined();
        expect(result.data).toHaveProperty('SignIn');
        expect(result.data.SignIn).toBeTruthy();
    }));
});
