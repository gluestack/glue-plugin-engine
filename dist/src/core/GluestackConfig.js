"use strict";
exports.__esModule = true;
exports.setConfig = exports.getConfig = exports.config = void 0;
exports.config = {
    backendInstancePath: '',
    engineInstancePath: '',
    hasuraInstancePath: '',
    hasuraEnvs: {}
};
var getConfig = function (key) { return exports.config[key]; };
exports.getConfig = getConfig;
var setConfig = function (key, value) { return exports.config[key] = value; };
exports.setConfig = setConfig;
//# sourceMappingURL=GluestackConfig.js.map