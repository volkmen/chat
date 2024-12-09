"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotImplementedError = exports.BadRequestError = exports.UnAuthorisedError = void 0;
const error_1 = require("graphql/error");
class UnAuthorisedError extends error_1.GraphQLError {
    constructor(msg) {
        super(msg, {
            extensions: {
                http: {
                    status: 401
                }
            }
        });
    }
}
exports.UnAuthorisedError = UnAuthorisedError;
class BadRequestError extends error_1.GraphQLError {
    constructor(msg) {
        super(msg, {
            extensions: {
                http: {
                    status: 403
                }
            }
        });
    }
}
exports.BadRequestError = BadRequestError;
class NotImplementedError extends error_1.GraphQLError {
    constructor(msg) {
        super(msg, {
            extensions: {
                http: {
                    status: 501
                }
            }
        });
    }
}
exports.NotImplementedError = NotImplementedError;
