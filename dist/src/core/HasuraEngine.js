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
        while (_) try {
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
var path_1 = require("path");
var promises_1 = require("node:fs/promises");
var spawn_1 = require("../helpers/spawn");
var file_exists_1 = require("../helpers/file-exists");
var remove_special_chars_1 = require("../helpers/remove-special-chars");
var GluestackConfig_1 = require("./GluestackConfig");
var HasuraMetadata_1 = __importDefault(require("./HasuraMetadata"));
var GluestackEvent_1 = __importDefault(require("./GluestackEvent"));
var promises_2 = require("fs/promises");
var HasuraEngine = (function () {
    function HasuraEngine(actionPlugins) {
        this.actionGQLFile = 'action.graphql';
        this.actionSettingFile = 'action.setting';
        this.actions = [];
        this.pluginName = (0, GluestackConfig_1.getConfig)('hasuraInstancePath');
        this.actionPlugins = actionPlugins;
        this.metadata = new HasuraMetadata_1["default"](this.pluginName);
        this.events = new GluestackEvent_1["default"](this.pluginName);
    }
    HasuraEngine.prototype.exportMetadata = function () {
        return __awaiter(this, void 0, void 0, function () {
            var filepath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filepath = (0, path_1.join)(process.cwd(), (0, GluestackConfig_1.getConfig)('backendInstancePath'), 'functions', this.pluginName);
                        return [4, (0, spawn_1.execute)('hasura', [
                                'metadata',
                                'export',
                                '--skip-update-check'
                            ], {
                                cwd: filepath,
                                stdio: 'inherit'
                            })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.applyMetadata = function () {
        return __awaiter(this, void 0, void 0, function () {
            var filepath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filepath = (0, path_1.join)(process.cwd(), (0, GluestackConfig_1.getConfig)('backendInstancePath'), 'functions', this.pluginName);
                        return [4, (0, spawn_1.execute)('hasura', [
                                'metadata',
                                'apply',
                                '--skip-update-check'
                            ], {
                                cwd: filepath,
                                stdio: 'inherit'
                            })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.applyMigrate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hasuraEnvs, filepath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hasuraEnvs = this.metadata.hasuraEnvs;
                        filepath = (0, path_1.join)(process.cwd(), (0, GluestackConfig_1.getConfig)('backendInstancePath'), 'functions', this.pluginName);
                        return [4, (0, spawn_1.execute)('hasura', [
                                'migrate',
                                'apply',
                                '--database-name',
                                hasuraEnvs.HASURA_GRAPHQL_DB_NAME,
                                '--skip-update-check'
                            ], {
                                cwd: filepath,
                                stdio: 'inherit'
                            })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.reapplyActions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('\n> Scanning for actions plugins...');
                        return [4, this.scanActions()];
                    case 1:
                        _a.sent();
                        console.log('> Dropping all actions from hasura engine...');
                        return [4, this.dropActions()];
                    case 2:
                        _a.sent();
                        console.log('> Creating all custom types for actions into hasura engine...');
                        return [4, this.createCustomTypes()];
                    case 3:
                        _a.sent();
                        console.log('> Registering actions plugins into hasura engine...');
                        return [4, this.createActions()];
                    case 4:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.reapplyEvents = function () {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var events, _b, _c, table, e_1_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4, this.events.scanEvents()];
                    case 1:
                        _d.sent();
                        console.log('> Dropping & Registering all events from hasura engine...');
                        return [4, this.events.getEventsByType('database')];
                    case 2:
                        events = _d.sent();
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 10, 11, 16]);
                        _b = __asyncValues(Object.keys(events));
                        _d.label = 4;
                    case 4: return [4, _b.next()];
                    case 5:
                        if (!(_c = _d.sent(), !_c.done)) return [3, 9];
                        table = _c.value;
                        return [4, this.metadata.dropEvent(table, events[table])];
                    case 6:
                        _d.sent();
                        return [4, this.metadata.createEvent(table, events[table])];
                    case 7:
                        _d.sent();
                        _d.label = 8;
                    case 8: return [3, 4];
                    case 9: return [3, 16];
                    case 10:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 16];
                    case 11:
                        _d.trys.push([11, , 14, 15]);
                        if (!(_c && !_c.done && (_a = _b["return"]))) return [3, 13];
                        return [4, _a.call(_b)];
                    case 12:
                        _d.sent();
                        _d.label = 13;
                    case 13: return [3, 15];
                    case 14:
                        if (e_1) throw e_1.error;
                        return [7];
                    case 15: return [7];
                    case 16: return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.applyTracks = function () {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function () {
            var backendInstancePath, authInstancePath, tracksPath, dirents, dirents_1, dirents_1_1, dirent, trackPath, track, trackJSON, error_1, e_2_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('> Scanning tracks directory...');
                        backendInstancePath = (0, GluestackConfig_1.getConfig)('backendInstancePath');
                        authInstancePath = (0, GluestackConfig_1.getConfig)('authInstancePath');
                        if (!authInstancePath || authInstancePath === '') {
                            return [2, Promise.resolve('No auth instance path found')];
                        }
                        tracksPath = (0, path_1.join)(process.cwd(), backendInstancePath, 'functions', this.pluginName, 'tracks');
                        if (!(0, file_exists_1.fileExists)(tracksPath)) {
                            console.log('> Nothing to track into hasura engine...');
                            return [2, Promise.resolve('No tracks folder found. Skipping...')];
                        }
                        console.log('> Applying all tracks into hasura engine...');
                        return [4, (0, promises_1.readdir)(tracksPath, { withFileTypes: true })];
                    case 1:
                        dirents = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 11, 12, 17]);
                        dirents_1 = __asyncValues(dirents);
                        _b.label = 3;
                    case 3: return [4, dirents_1.next()];
                    case 4:
                        if (!(dirents_1_1 = _b.sent(), !dirents_1_1.done)) return [3, 10];
                        dirent = dirents_1_1.value;
                        if (!(dirent.isFile() && (0, path_1.extname)(dirent.name).toLowerCase() === '.json')) return [3, 9];
                        trackPath = (0, path_1.join)(tracksPath, dirent.name);
                        _b.label = 5;
                    case 5:
                        _b.trys.push([5, 8, , 9]);
                        return [4, (0, promises_2.readFile)(trackPath)];
                    case 6:
                        track = _b.sent();
                        trackJSON = JSON.parse(track.toString());
                        return [4, this.metadata.tracks(trackJSON)];
                    case 7:
                        _b.sent();
                        return [3, 9];
                    case 8:
                        error_1 = _b.sent();
                        return [3, 9];
                    case 9: return [3, 3];
                    case 10: return [3, 17];
                    case 11:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3, 17];
                    case 12:
                        _b.trys.push([12, , 15, 16]);
                        if (!(dirents_1_1 && !dirents_1_1.done && (_a = dirents_1["return"]))) return [3, 14];
                        return [4, _a.call(dirents_1)];
                    case 13:
                        _b.sent();
                        _b.label = 14;
                    case 14: return [3, 16];
                    case 15:
                        if (e_2) throw e_2.error;
                        return [7];
                    case 16: return [7];
                    case 17: return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.scanActions = function () {
        var e_3, _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _c, plugin, exist, e_3_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 7, 8, 13]);
                        _b = __asyncValues(this.actionPlugins);
                        _d.label = 1;
                    case 1: return [4, _b.next()];
                    case 2:
                        if (!(_c = _d.sent(), !_c.done)) return [3, 6];
                        plugin = _c.value;
                        return [4, (0, file_exists_1.fileExists)(plugin.path)];
                    case 3:
                        exist = _d.sent();
                        if (!exist) {
                            console.log("> Action Instance ".concat(plugin.instance, " is missing. Skipping..."));
                            return [3, 5];
                        }
                        return [4, (0, file_exists_1.fileExists)((0, path_1.join)(plugin.path, this.actionGQLFile))];
                    case 4:
                        exist = _d.sent();
                        if (!exist) {
                            console.log("> Action Instance ".concat(plugin.instance, " does not have actions.graphql file. Skipping..."));
                            return [3, 5];
                        }
                        this.actions.push({
                            name: (0, remove_special_chars_1.removeSpecialChars)(plugin.instance),
                            path: plugin.path,
                            grapqhl_path: (0, path_1.join)(plugin.path, this.actionGQLFile),
                            setting_path: (0, path_1.join)(plugin.path, this.actionSettingFile)
                        });
                        _d.label = 5;
                    case 5: return [3, 1];
                    case 6: return [3, 13];
                    case 7:
                        e_3_1 = _d.sent();
                        e_3 = { error: e_3_1 };
                        return [3, 13];
                    case 8:
                        _d.trys.push([8, , 11, 12]);
                        if (!(_c && !_c.done && (_a = _b["return"]))) return [3, 10];
                        return [4, _a.call(_b)];
                    case 9:
                        _d.sent();
                        _d.label = 10;
                    case 10: return [3, 12];
                    case 11:
                        if (e_3) throw e_3.error;
                        return [7];
                    case 12: return [7];
                    case 13: return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.dropActions = function () {
        var e_4, _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _c, action, e_4_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (this.actions.length <= 0) {
                            return [2, Promise.resolve(false)];
                        }
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 7, 8, 13]);
                        _b = __asyncValues(this.actions);
                        _d.label = 2;
                    case 2: return [4, _b.next()];
                    case 3:
                        if (!(_c = _d.sent(), !_c.done)) return [3, 6];
                        action = _c.value;
                        return [4, this.metadata.dropAction(action.name)];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5: return [3, 2];
                    case 6: return [3, 13];
                    case 7:
                        e_4_1 = _d.sent();
                        e_4 = { error: e_4_1 };
                        return [3, 13];
                    case 8:
                        _d.trys.push([8, , 11, 12]);
                        if (!(_c && !_c.done && (_a = _b["return"]))) return [3, 10];
                        return [4, _a.call(_b)];
                    case 9:
                        _d.sent();
                        _d.label = 10;
                    case 10: return [3, 12];
                    case 11:
                        if (e_4) throw e_4.error;
                        return [7];
                    case 12: return [7];
                    case 13: return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.createActions = function () {
        var e_5, _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _c, action, e_5_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (this.actions.length <= 0) {
                            return [2, Promise.resolve(false)];
                        }
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 7, 8, 13]);
                        _b = __asyncValues(this.actions);
                        _d.label = 2;
                    case 2: return [4, _b.next()];
                    case 3:
                        if (!(_c = _d.sent(), !_c.done)) return [3, 6];
                        action = _c.value;
                        return [4, this.metadata.createAction(action)];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5: return [3, 2];
                    case 6: return [3, 13];
                    case 7:
                        e_5_1 = _d.sent();
                        e_5 = { error: e_5_1 };
                        return [3, 13];
                    case 8:
                        _d.trys.push([8, , 11, 12]);
                        if (!(_c && !_c.done && (_a = _b["return"]))) return [3, 10];
                        return [4, _a.call(_b)];
                    case 9:
                        _d.sent();
                        _d.label = 10;
                    case 10: return [3, 12];
                    case 11:
                        if (e_5) throw e_5.error;
                        return [7];
                    case 12: return [7];
                    case 13: return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.createCustomTypes = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.actions.length <= 0) {
                            return [2, Promise.resolve(false)];
                        }
                        return [4, this.metadata.createCustomTypes(this.actions)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return HasuraEngine;
}());
exports["default"] = HasuraEngine;
//# sourceMappingURL=HasuraEngine.js.map