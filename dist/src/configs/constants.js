"use strict";
exports.__esModule = true;
exports.daprServices = exports.noDockerfiles = exports.ignorePlugins = exports.backendPlugins = void 0;
exports.backendPlugins = [
    '@gluestack/glue-plugin-*'
];
exports.ignorePlugins = [
    '@gluestack/glue-plugin-engine'
];
exports.noDockerfiles = [
    '@gluestack/glue-plugin-graphql',
    '@gluestack/glue-plugin-postgres',
    '@gluestack/glue-plugin-minio',
    '@gluestack/glue-plugin-engine'
];
exports.daprServices = [
    '@gluestack/glue-plugin-backend-engine',
    '@gluestack/glue-plugin-auth',
    '@gluestack/glue-plugin-storage',
    '@gluestack/glue-plugin-service-*'
];
//# sourceMappingURL=constants.js.map