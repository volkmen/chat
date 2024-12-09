"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdFromContext = getUserIdFromContext;
exports.getAuthResource = getAuthResource;
exports.getUsersResource = getUsersResource;
function getUserIdFromContext(ctx) {
    return +ctx.tokenPayload.id;
}
function getAuthResource(context) {
    return context.dataSources.auth;
}
function getUsersResource(context) {
    return context.dataSources.users;
}
