"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const server_1 = __importDefault(require("./server"));
const typeorm_1 = require("./services/typeorm");
const app = new server_1.default();
Promise.all([
    (0, typeorm_1.connectToDatabase)({
        migrationsRun: true
    }),
    app.initServer()
]).then(([dbDataSource]) => {
    app.initContext(dbDataSource);
    app.listen(4000);
});
