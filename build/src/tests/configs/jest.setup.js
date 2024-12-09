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
const typeorm_1 = require("../../services/typeorm");
const executor_http_1 = require("@graphql-tools/executor-http");
const server_1 = __importDefault(require("../../server"));
const nodemailer_1 = __importDefault(require("nodemailer"));
jest.spyOn(nodemailer_1.default, 'createTransport').mockImplementation(() => {
    return {
        sendMail: jest.fn().mockResolvedValue(true)
    };
});
let dbConnection;
// let signedInExecutor;
// let signedOutExecutor;
jest.spyOn(nodemailer_1.default, 'createTransport').mockImplementation(() => {
    return {
        sendMail: jest.fn().mockResolvedValue(null)
    };
});
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    dbConnection = yield (0, typeorm_1.connectToDatabase)({
        database: 'test',
        synchronize: true
    });
    const server = new server_1.default();
    yield server.initServer();
    yield server.initContext(dbConnection);
    global.signedOutExecutor = (0, executor_http_1.buildHTTPExecutor)({
        fetch: server.yoga.fetch,
        endpoint: `/graphiql`
    });
    const jwtToken = server.jwtService.createToken({ id: 1 });
    global.defaultUserExecutor = (0, executor_http_1.buildHTTPExecutor)({
        fetch: server.yoga.fetch,
        endpoint: `/graphiql`,
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    });
    global.dbConnection = dbConnection;
    global.server = server;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure proper cleanup of the server (e.g., close server and DB connections)
    yield dbConnection.close();
}));
