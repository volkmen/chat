"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const typeORMBseConfig = {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: +process.env.DATABASE_PORT || 5432,
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'wolf',
    database: process.env.DATABASE_NAME || 'vid',
    entities: [node_path_1.default.join(process.cwd(), 'src/entities/**/*.entity.ts')],
    migrations: [node_path_1.default.join(process.cwd(), 'src/migrations/*.ts')]
};
exports.default = typeORMBseConfig;
