"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const typeorm_base_config_1 = __importDefault(require("./src/configs/typeorm-base.config"));
const dataSourceConfig = new typeorm_1.DataSource(typeorm_base_config_1.default);
exports.default = dataSourceConfig;
