"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    overwrite: true,
    schema: 'src/**/*.graphql',
    generates: {
        'src/types/graphql.d.ts': {
            plugins: ['typescript']
        }
    }
};
exports.default = config;
