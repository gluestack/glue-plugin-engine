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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
var path_1 = require("path");
var write_file_1 = require("../helpers/write-file");
var replace_keyword_1 = require("../helpers/replace-keyword");
var GluestackEngine = (function () {
    function GluestackEngine(app) {
        this.app = app;
    }
    GluestackEngine.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2];
        }); });
    };
    GluestackEngine.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2];
        }); });
    };
    GluestackEngine.prototype.startDockerCompose = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2];
        }); });
    };
    GluestackEngine.prototype.stopDockerCompose = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2];
        }); });
    };
    GluestackEngine.prototype.cleanDockerVolumes = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2];
        }); });
    };
    GluestackEngine.prototype.collectDockerContext = function () {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var app, arr, instances, _d, instances_1, instances_1_1, instance, type, details, e_1_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        app = this.app;
                        arr = [];
                        instances = app.getContainerTypePluginInstances(false);
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 10, 11, 16]);
                        _d = true, instances_1 = __asyncValues(instances);
                        _e.label = 2;
                    case 2: return [4, instances_1.next()];
                    case 3:
                        if (!(instances_1_1 = _e.sent(), _a = instances_1_1.done, !_a)) return [3, 9];
                        _c = instances_1_1.value;
                        _d = false;
                        _e.label = 4;
                    case 4:
                        _e.trys.push([4, , 7, 8]);
                        instance = _c;
                        type = instance === null || instance === void 0 ? void 0 : instance.callerPlugin.getType();
                        if (!(instance && (instance === null || instance === void 0 ? void 0 : instance.containerController) && type && type === 'stateless')) return [3, 6];
                        details = {
                            name: instance.callerPlugin.getName(),
                            template_folder: instance.callerPlugin.getTemplateFolderPath(),
                            instance: instance.getName(),
                            path: (0, path_1.join)(process.cwd(), instance.getInstallationPath()),
                            status: instance.getContainerController().getStatus(),
                            port: instance.getContainerController().getStatus() === "up"
                                ? instance.getContainerController().portNumber || "-"
                                : "-",
                            "container_id/pid": instance.getContainerController().getContainerId() || "-"
                        };
                        return [4, this.collectDockerfiles(details, instance)];
                    case 5:
                        _e.sent();
                        arr.push(details);
                        _e.label = 6;
                    case 6: return [3, 8];
                    case 7:
                        _d = true;
                        return [7];
                    case 8: return [3, 2];
                    case 9: return [3, 16];
                    case 10:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 16];
                    case 11:
                        _e.trys.push([11, , 14, 15]);
                        if (!(!_d && !_a && (_b = instances_1["return"]))) return [3, 13];
                        return [4, _b.call(instances_1)];
                    case 12:
                        _e.sent();
                        _e.label = 13;
                    case 13: return [3, 15];
                    case 14:
                        if (e_1) throw e_1.error;
                        return [7];
                    case 15: return [7];
                    case 16:
                        this.statelessPlugins = arr;
                        return [2];
                }
            });
        });
    };
    GluestackEngine.prototype.collectDockerfiles = function (details, instance) {
        return __awaiter(this, void 0, void 0, function () {
            var dockerfile, context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dockerfile = (0, path_1.join)(process.cwd(), 'node_modules', instance.callerPlugin.getName(), 'src/assets/Dockerfile');
                        return [4, (0, replace_keyword_1.replaceKeyword)(dockerfile, instance.getName(), '{APP_ID}')];
                    case 1:
                        context = _a.sent();
                        return [4, (0, write_file_1.writeFile)((0, path_1.join)(details.path, 'Dockerfile'), context)];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    GluestackEngine.prototype.createDockerCompose = function () {
        var _a, e_2, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var app, instances, _d, instances_2, instances_2_1, instance, e_2_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        app = this.app;
                        instances = app.getContainerTypePluginInstances(false);
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 6, 7, 12]);
                        _d = true, instances_2 = __asyncValues(instances);
                        _e.label = 2;
                    case 2: return [4, instances_2.next()];
                    case 3:
                        if (!(instances_2_1 = _e.sent(), _a = instances_2_1.done, !_a)) return [3, 5];
                        _c = instances_2_1.value;
                        _d = false;
                        try {
                            instance = _c;
                        }
                        finally {
                            _d = true;
                        }
                        _e.label = 4;
                    case 4: return [3, 2];
                    case 5: return [3, 12];
                    case 6:
                        e_2_1 = _e.sent();
                        e_2 = { error: e_2_1 };
                        return [3, 12];
                    case 7:
                        _e.trys.push([7, , 10, 11]);
                        if (!(!_d && !_a && (_b = instances_2["return"]))) return [3, 9];
                        return [4, _b.call(instances_2)];
                    case 8:
                        _e.sent();
                        _e.label = 9;
                    case 9: return [3, 11];
                    case 10:
                        if (e_2) throw e_2.error;
                        return [7];
                    case 11: return [7];
                    case 12: return [2];
                }
            });
        });
    };
    return GluestackEngine;
}());
exports["default"] = GluestackEngine;
//# sourceMappingURL=GluestackEngine.js.map