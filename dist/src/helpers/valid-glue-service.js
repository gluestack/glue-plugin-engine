"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGlueService = exports.isDaprService = exports.isValidGluePlugin = void 0;
var constants_1 = require("../configs/constants");
var isValidGluePlugin = function (backendPlugins, name) {
    var validPlugins = [];
    if (constants_1.ignorePlugins.includes(name)) {
        return validPlugins;
    }
    backendPlugins.forEach(function (_plugin) {
        if (_plugin === name) {
            validPlugins.push(name);
        }
        if (_plugin.includes('*')) {
            var _name = '@gluestack/glue-plugin-';
            if (name && name.startsWith(_name)) {
                validPlugins.push(name);
            }
        }
    });
    return validPlugins;
};
exports.isValidGluePlugin = isValidGluePlugin;
var isDaprService = function (name) {
    if (constants_1.daprServices.includes(name)) {
        return true;
    }
    var _name = '@gluestack/glue-plugin-service-';
    if (name.startsWith(_name)) {
        return true;
    }
    else {
        return false;
    }
};
exports.isDaprService = isDaprService;
var isGlueService = function (name) {
    var _name = '@gluestack/glue-plugin-service-';
    if (name.startsWith(_name)) {
        return true;
    }
    else {
        return false;
    }
};
exports.isGlueService = isGlueService;
//# sourceMappingURL=valid-glue-service.js.map