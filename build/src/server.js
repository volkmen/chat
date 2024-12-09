"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const path = __importStar(require("node:path"));
const node_http_1 = require("node:http");
const graphql_yoga_1 = require("graphql-yoga");
const load_files_1 = require("@graphql-tools/load-files");
const merge_1 = require("@graphql-tools/merge");
const AuthDataSource_1 = __importDefault(require("./resolvers/auth/AuthDataSource"));
const UsersDataSource_1 = __importDefault(require("./resolvers/users/UsersDataSource"));
const ChatDataSource_1 = __importDefault(require("./resolvers/chats/ChatDataSource"));
const resolvers_1 = __importDefault(require("./resolvers"));
const emailer_1 = __importDefault(require("./services/emailer"));
const jwtService_1 = __importDefault(require("./services/jwtService"));
class App {
    constructor() {
        this.jwtService = new jwtService_1.default();
        this.getContext = (_a) => __awaiter(this, [_a], void 0, function* ({ request }) {
            const tokenPayload = yield this.context.jwtService.parsePayload(request);
            return Object.assign(Object.assign({}, this.context), { tokenPayload });
        });
        this.formatError = (err) => {
            return err;
        };
    }
    getTypeDefs() {
        return __awaiter(this, void 0, void 0, function* () {
            const loadedFiles = yield (0, load_files_1.loadFiles)(path.join(process.cwd(), 'src', 'schema.graphql'));
            return (0, merge_1.mergeTypeDefs)(loadedFiles);
        });
    }
    initContextServices(dbConnection) {
        this.context = {
            emailVerificationService: new emailer_1.default(),
            jwtService: this.jwtService,
            dataSources: {
                auth: new AuthDataSource_1.default(dbConnection),
                users: new UsersDataSource_1.default(dbConnection),
                chats: new ChatDataSource_1.default(dbConnection)
            }
        };
    }
    initServer() {
        return __awaiter(this, void 0, void 0, function* () {
            const typeDefs = yield this.getTypeDefs();
            this.yoga = (0, graphql_yoga_1.createYoga)({
                schema: (0, graphql_yoga_1.createSchema)({
                    typeDefs,
                    resolvers: resolvers_1.default
                }),
                context: this.getContext,
                graphqlEndpoint: '/graphiql'
            });
            this.server = (0, node_http_1.createServer)(this.yoga);
            return this.yoga;
        });
    }
    listen(port) {
        this.server.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    }
    initContext(dbConnection) {
        return __awaiter(this, void 0, void 0, function* () {
            this.initContextServices(dbConnection);
            this.dbConnection = dbConnection;
        });
    }
    close() {
        return this.server.close();
    }
}
exports.default = App;
