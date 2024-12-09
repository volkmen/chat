"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
const typeorm_1 = require("typeorm");
const typeorm_base_config_1 = __importDefault(require("../configs/typeorm-base.config"));
const env_1 = require("../utils/env");
const isDevelopment = (0, env_1.getIsDevelopment)();
function connectToDatabase(dataSourceOptions) {
    const options = Object.assign(Object.assign(Object.assign(Object.assign({}, typeorm_base_config_1.default), { logging: isDevelopment }), dataSourceOptions));
    const dataSource = new typeorm_1.DataSource(options);
    return dataSource.connect();
}
