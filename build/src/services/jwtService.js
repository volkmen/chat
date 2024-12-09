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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_util_1 = require("node:util");
const env_1 = require("../utils/env");
const verify = (0, node_util_1.promisify)(jsonwebtoken_1.default.verify);
const isDevelopment = (0, env_1.getIsDevelopment)();
class JwtService {
    constructor() {
        this.secret = 'SECRET';
        this.createToken = payload => {
            return jsonwebtoken_1.default.sign(payload, this.secret, {
                expiresIn: isDevelopment ? 1000 * 60 * 60 * 24 * 30 : '1d'
            });
        };
    }
    getTokenFromRequest(req) {
        const authorization = req.headers.get('Authorization');
        if (!authorization) {
            return null;
        }
        return authorization.slice('Bearer '.length);
    }
    parsePayload(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = this.getTokenFromRequest(req);
            try {
                if (token) {
                    const payload = yield verify(token, this.secret);
                    return payload;
                }
                return null;
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
}
exports.default = JwtService;
