"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIsDevelopment = void 0;
const getIsDevelopment = () => {
    return process.env.NODE_ENV === 'DEVELOPMENT';
};
exports.getIsDevelopment = getIsDevelopment;
