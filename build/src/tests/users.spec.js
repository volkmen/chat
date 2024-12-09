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
jest.spyOn(nodemailer_1.default, 'createTransport').mockImplementation(() => {
    return {
        sendMail: jest.fn().mockResolvedValue(true)
    };
});
describe('USERS', () => {
    let executor;
    beforeEach(() => {
        executor = globalThis.defaultUserExecutor;
    });
    it('Get me', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield executor({
            document: (0, graphql_1.parse)(/* GraphQL */ `
        query GetMe {
          GetMe {
            username
          }
        }
      `)
        });
        expect(result).toBeDefined();
        expect(result.data).toHaveProperty('GetMe');
        expect(result.data.GetMe.username).toBeTruthy();
    }));
    it('Get users should exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield executor({
            document: (0, graphql_1.parse)(/* GraphQL */ `
        query GetUsers {
          GetUsers {
            username
          }
        }
      `)
        });
        expect(result).toBeDefined();
        expect(result.data).toHaveProperty('GetUsers');
        expect(result.data.GetUsers).toBeTruthy();
    }));
    it('should update me', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield executor({
            document: (0, graphql_1.parse)(/* GraphQL */ `
        mutation UpdateMe {
          UpdateMe(username: "yar") {
            username
          }
        }
      `)
        });
        expect(result).toBeDefined();
        expect(result.data).toHaveProperty('UpdateMe');
        expect(result.data.UpdateMe).toEqual({ username: 'yar' });
    }));
});
