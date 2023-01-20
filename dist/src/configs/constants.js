"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noDockerfiles = exports.backendPlugins = void 0;
exports.backendPlugins = [
    '@gluestack/glue-plugin-postgres',
    '@gluestack/glue-plugin-graphql',
    '@gluestack/glue-plugin-engine',
    '@gluestack/glue-plugin-functions',
    '@gluestack/glue-plugin-functions.action',
    '@gluestack/glue-plugin-auth',
    '@gluestack/glue-plugin-storage',
    '@gluestack/glue-plugin-functions-*'
];
exports.noDockerfiles = [
    '@gluestack/glue-plugin-graphql',
    '@gluestack/glue-plugin-postgres'
];
//# sourceMappingURL=constants.js.map