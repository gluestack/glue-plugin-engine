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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.runner = exports.developWatch = void 0;
var path_1 = require("path");
var watcher_1 = __importDefault(require("../helpers/watcher"));
function developWatch(program, glueStackPlugin) {
    var command = program
        .command("develop:watch")
        .description("Watches and restarts provided container instances")
        .action(function () { return runner(glueStackPlugin); });
}
exports.developWatch = developWatch;
function runner(glueStackPlugin) {
    var _a, e_1, _b, _c, _d, e_2, _e, _f;
    return __awaiter(this, void 0, void 0, function () {
        var instances, paths, _g, instances_1, instances_1_1, instance, files, _h, files_1, files_1_1, file, _name, e_2_1, e_3, e_1_1, watcher_2;
        var _this = this;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    instances = glueStackPlugin.app.getContainerTypePluginInstances(true);
                    paths = [];
                    _j.label = 1;
                case 1:
                    _j.trys.push([1, 25, 26, 31]);
                    _g = true, instances_1 = __asyncValues(instances);
                    _j.label = 2;
                case 2: return [4, instances_1.next()];
                case 3:
                    if (!(instances_1_1 = _j.sent(), _a = instances_1_1.done, !_a)) return [3, 24];
                    _c = instances_1_1.value;
                    _g = false;
                    _j.label = 4;
                case 4:
                    _j.trys.push([4, , 22, 23]);
                    instance = _c;
                    if (!(instance && (instance === null || instance === void 0 ? void 0 : instance.containerController))) return [3, 21];
                    _j.label = 5;
                case 5:
                    _j.trys.push([5, 19, , 20]);
                    if (!(typeof instance.containerController.watch === 'function')) return [3, 18];
                    return [4, instance.containerController.watch()];
                case 6:
                    files = _j.sent();
                    _j.label = 7;
                case 7:
                    _j.trys.push([7, 12, 13, 18]);
                    _h = true, files_1 = (e_2 = void 0, __asyncValues(files));
                    _j.label = 8;
                case 8: return [4, files_1.next()];
                case 9:
                    if (!(files_1_1 = _j.sent(), _d = files_1_1.done, !_d)) return [3, 11];
                    _f = files_1_1.value;
                    _h = false;
                    try {
                        file = _f;
                        _name = instance.getInstallationPath(instance.getName());
                        paths.push((0, path_1.join)(_name, file));
                    }
                    finally {
                        _h = true;
                    }
                    _j.label = 10;
                case 10: return [3, 8];
                case 11: return [3, 18];
                case 12:
                    e_2_1 = _j.sent();
                    e_2 = { error: e_2_1 };
                    return [3, 18];
                case 13:
                    _j.trys.push([13, , 16, 17]);
                    if (!(!_h && !_d && (_e = files_1["return"]))) return [3, 15];
                    return [4, _e.call(files_1)];
                case 14:
                    _j.sent();
                    _j.label = 15;
                case 15: return [3, 17];
                case 16:
                    if (e_2) throw e_2.error;
                    return [7];
                case 17: return [7];
                case 18: return [3, 20];
                case 19:
                    e_3 = _j.sent();
                    console.log("Failed: ".concat(instance.getName(), " instance could not be started"));
                    console.log("\x1b[33m\nError:\x1b[31m", e_3.message, "\x1b[0m");
                    return [3, 20];
                case 20:
                    console.log();
                    _j.label = 21;
                case 21: return [3, 23];
                case 22:
                    _g = true;
                    return [7];
                case 23: return [3, 2];
                case 24: return [3, 31];
                case 25:
                    e_1_1 = _j.sent();
                    e_1 = { error: e_1_1 };
                    return [3, 31];
                case 26:
                    _j.trys.push([26, , 29, 30]);
                    if (!(!_g && !_a && (_b = instances_1["return"]))) return [3, 28];
                    return [4, _b.call(instances_1)];
                case 27:
                    _j.sent();
                    _j.label = 28;
                case 28: return [3, 30];
                case 29:
                    if (e_1) throw e_1.error;
                    return [7];
                case 30: return [7];
                case 31:
                    if (paths.length > 0) {
                        watcher_2 = new watcher_1["default"](paths);
                        watcher_2.on('add', function (path) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!!watcher_2.getStatus()) return [3, 2];
                                        watcher_2.restart(true);
                                        return [4, restartsWatchedContainers(instances)];
                                    case 1:
                                        _a.sent();
                                        watcher_2.restart(false);
                                        _a.label = 2;
                                    case 2: return [2];
                                }
                            });
                        }); });
                        watcher_2.on('change', function (path) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!!watcher_2.getStatus()) return [3, 2];
                                        watcher_2.restart(true);
                                        return [4, restartsWatchedContainers(instances)];
                                    case 1:
                                        _a.sent();
                                        watcher_2.restart(false);
                                        _a.label = 2;
                                    case 2: return [2];
                                }
                            });
                        }); });
                        watcher_2.on('unlink', function (path) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!!watcher_2.getStatus()) return [3, 2];
                                        watcher_2.restart(true);
                                        return [4, restartsWatchedContainers(instances)];
                                    case 1:
                                        _a.sent();
                                        watcher_2.restart(false);
                                        _a.label = 2;
                                    case 2: return [2];
                                }
                            });
                        }); });
                        process.on('SIGINT', function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, restartsWatchedContainers(instances, true)];
                                    case 1:
                                        _a.sent();
                                        process.exit(0);
                                        return [2];
                                }
                            });
                        }); });
                        process.on('SIGQUIT', function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, restartsWatchedContainers(instances, true)];
                                    case 1:
                                        _a.sent();
                                        process.exit(0);
                                        return [2];
                                }
                            });
                        }); });
                        process.on('SIGTERM', function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, restartsWatchedContainers(instances, true)];
                                    case 1:
                                        _a.sent();
                                        process.exit(0);
                                        return [2];
                                }
                            });
                        }); });
                    }
                    else {
                        console.log('Nothing to watch. Terminating!');
                    }
                    return [2];
            }
        });
    });
}
exports.runner = runner;
function restartsWatchedContainers(instances, down) {
    var _a, instances_2, instances_2_1;
    var _b, e_4, _c, _d;
    if (down === void 0) { down = false; }
    return __awaiter(this, void 0, void 0, function () {
        var instance, e_5, e_4_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 14, 15, 20]);
                    _a = true, instances_2 = __asyncValues(instances);
                    _e.label = 1;
                case 1: return [4, instances_2.next()];
                case 2:
                    if (!(instances_2_1 = _e.sent(), _b = instances_2_1.done, !_b)) return [3, 13];
                    _d = instances_2_1.value;
                    _a = false;
                    _e.label = 3;
                case 3:
                    _e.trys.push([3, , 11, 12]);
                    instance = _d;
                    if (!(instance && (instance === null || instance === void 0 ? void 0 : instance.containerController))) return [3, 10];
                    _e.label = 4;
                case 4:
                    _e.trys.push([4, 8, , 9]);
                    return [4, instance.containerController.down()];
                case 5:
                    _e.sent();
                    if (!!down) return [3, 7];
                    return [4, instance.containerController.up()];
                case 6:
                    _e.sent();
                    _e.label = 7;
                case 7: return [3, 9];
                case 8:
                    e_5 = _e.sent();
                    console.log("Failed: ".concat(instance.getName(), " instance could not be started"));
                    console.log("\x1b[33m\nError:\x1b[31m", e_5.message, "\x1b[0m");
                    return [3, 9];
                case 9:
                    console.log();
                    _e.label = 10;
                case 10: return [3, 12];
                case 11:
                    _a = true;
                    return [7];
                case 12: return [3, 1];
                case 13: return [3, 20];
                case 14:
                    e_4_1 = _e.sent();
                    e_4 = { error: e_4_1 };
                    return [3, 20];
                case 15:
                    _e.trys.push([15, , 18, 19]);
                    if (!(!_a && !_b && (_c = instances_2["return"]))) return [3, 17];
                    return [4, _c.call(instances_2)];
                case 16:
                    _e.sent();
                    _e.label = 17;
                case 17: return [3, 19];
                case 18:
                    if (e_4) throw e_4.error;
                    return [7];
                case 19: return [7];
                case 20: return [2];
            }
        });
    });
}
//# sourceMappingURL=develop-watch.js.map