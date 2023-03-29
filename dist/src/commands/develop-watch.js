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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runner = exports.developWatch = void 0;
var path_1 = require("path");
var GlueStackWatch_1 = __importDefault(require("../core/GlueStackWatch"));
var GluestackEngine_1 = __importDefault(require("../core/GluestackEngine"));
function developWatch(program, glueStackPlugin) {
    var command = program
        .command("develop:watch")
        .description("Watches and restarts containers when registered plugins files changes")
        .action(function () { return runner(glueStackPlugin); });
}
exports.developWatch = developWatch;
function runner(gluestackPlugin) {
    return __awaiter(this, void 0, void 0, function () {
        var instances, paths, watcher;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    instances = gluestackPlugin.app.getContainerTypePluginInstances(true);
                    return [4, scanForWatchables(instances)];
                case 1:
                    paths = _a.sent();
                    if (paths.length <= 0) {
                        console.log('> Nothing to watch. Terminating!');
                        process.exit(-1);
                    }
                    console.log("> Watching ".concat(paths.length, " directories/files for changes..."));
                    watcher = new GlueStackWatch_1.default(paths);
                    watcher.on('add', function (path) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!!watcher.getStatus()) return [3, 2];
                                    watcher.restart(true);
                                    return [4, restartsWatchedContainers(gluestackPlugin.app)];
                                case 1:
                                    _a.sent();
                                    watcher.restart(false);
                                    _a.label = 2;
                                case 2: return [2];
                            }
                        });
                    }); });
                    watcher.on('change', function (path) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!!watcher.getStatus()) return [3, 2];
                                    watcher.restart(true);
                                    return [4, restartsWatchedContainers(gluestackPlugin.app)];
                                case 1:
                                    _a.sent();
                                    watcher.restart(false);
                                    _a.label = 2;
                                case 2: return [2];
                            }
                        });
                    }); });
                    watcher.on('unlink', function (path) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!!watcher.getStatus()) return [3, 2];
                                    watcher.restart(true);
                                    return [4, restartsWatchedContainers(gluestackPlugin.app)];
                                case 1:
                                    _a.sent();
                                    watcher.restart(false);
                                    _a.label = 2;
                                case 2: return [2];
                            }
                        });
                    }); });
                    process.on('SIGINT', function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log('> Gracefully shutting down Gluestack Engine... Please wait as we gracefully shut down all the containers. Thank You!');
                                    return [4, restartsWatchedContainers(gluestackPlugin.app, true)];
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
                                case 0:
                                    console.log('> Gracefully shutting down Gluestack Engine... Please wait as we gracefully shut down all the containers. Thank You!');
                                    return [4, restartsWatchedContainers(gluestackPlugin.app, true)];
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
                                case 0:
                                    console.log('> Gracefully shutting down Gluestack Engine... Please wait as we gracefully shut down all the containers. Thank You!');
                                    return [4, restartsWatchedContainers(gluestackPlugin.app, true)];
                                case 1:
                                    _a.sent();
                                    process.exit(0);
                                    return [2];
                            }
                        });
                    }); });
                    return [2];
            }
        });
    });
}
exports.runner = runner;
;
var restartsWatchedContainers = function (app, down) {
    if (down === void 0) { down = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var engine, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    engine = new GluestackEngine_1.default(app, 'backend');
                    return [4, engine.stop()];
                case 1:
                    _a.sent();
                    if (!!down) return [3, 3];
                    return [4, engine.start()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3, 5];
                case 4:
                    err_1 = _a.sent();
                    console.log('>> err', err_1);
                    return [3, 5];
                case 5: return [2];
            }
        });
    });
};
var scanForWatchables = function (instances) { var _a, instances_1, instances_1_1; return __awaiter(void 0, void 0, void 0, function () {
    var paths, instance, files, _b, files_1, files_1_1, file, _name, e_1_1, e_2, e_3_1;
    var _c, e_3, _d, _e, _f, e_1, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                paths = [];
                _j.label = 1;
            case 1:
                _j.trys.push([1, 25, 26, 31]);
                _a = true, instances_1 = __asyncValues(instances);
                _j.label = 2;
            case 2: return [4, instances_1.next()];
            case 3:
                if (!(instances_1_1 = _j.sent(), _c = instances_1_1.done, !_c)) return [3, 24];
                _e = instances_1_1.value;
                _a = false;
                _j.label = 4;
            case 4:
                _j.trys.push([4, , 22, 23]);
                instance = _e;
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
                _b = true, files_1 = (e_1 = void 0, __asyncValues(files));
                _j.label = 8;
            case 8: return [4, files_1.next()];
            case 9:
                if (!(files_1_1 = _j.sent(), _f = files_1_1.done, !_f)) return [3, 11];
                _h = files_1_1.value;
                _b = false;
                try {
                    file = _h;
                    _name = instance.getInstallationPath(instance.getName());
                    paths.push((0, path_1.join)(_name, file));
                }
                finally {
                    _b = true;
                }
                _j.label = 10;
            case 10: return [3, 8];
            case 11: return [3, 18];
            case 12:
                e_1_1 = _j.sent();
                e_1 = { error: e_1_1 };
                return [3, 18];
            case 13:
                _j.trys.push([13, , 16, 17]);
                if (!(!_b && !_f && (_g = files_1.return))) return [3, 15];
                return [4, _g.call(files_1)];
            case 14:
                _j.sent();
                _j.label = 15;
            case 15: return [3, 17];
            case 16:
                if (e_1) throw e_1.error;
                return [7];
            case 17: return [7];
            case 18: return [3, 20];
            case 19:
                e_2 = _j.sent();
                console.log("Failed: ".concat(instance.getName(), " instance could not be started"));
                console.log("\x1b[33m\nError:\x1b[31m", e_2.message, "\x1b[0m");
                return [3, 20];
            case 20:
                console.log();
                _j.label = 21;
            case 21: return [3, 23];
            case 22:
                _a = true;
                return [7];
            case 23: return [3, 2];
            case 24: return [3, 31];
            case 25:
                e_3_1 = _j.sent();
                e_3 = { error: e_3_1 };
                return [3, 31];
            case 26:
                _j.trys.push([26, , 29, 30]);
                if (!(!_a && !_c && (_d = instances_1.return))) return [3, 28];
                return [4, _d.call(instances_1)];
            case 27:
                _j.sent();
                _j.label = 28;
            case 28: return [3, 30];
            case 29:
                if (e_3) throw e_3.error;
                return [7];
            case 30: return [7];
            case 31: return [2, paths];
        }
    });
}); };
//# sourceMappingURL=develop-watch.js.map