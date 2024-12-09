"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthResolver = createAuthResolver;
exports.getQueryFieldsMapFromGraphQLRequestedInfo = getQueryFieldsMapFromGraphQLRequestedInfo;
const errors_1 = require("./errors");
const class_validator_1 = require("class-validator");
function createAuthResolver(callbackResolverFunction) {
    return (_, args, context, info) => {
        if (!context.tokenPayload) {
            throw new errors_1.UnAuthorisedError('Token is missing');
        }
        return callbackResolverFunction(_, args, context, info);
    };
}
function getQueryFieldsMapFromGraphQLRequestedInfo(requestInfoField) {
    return requestInfoField.fieldNodes[0].selectionSet.selections.reduce((acc, sel) => {
        if ('name' in sel && (0, class_validator_1.isString)(sel.name.value)) {
            acc[sel.name.value] = true;
        }
        return acc;
    }, {});
}
