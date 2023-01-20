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
var path_1 = require("path");
var promises_1 = require("node:fs/promises");
var spawn_1 = require("../helpers/spawn");
var file_exists_1 = require("../helpers/file-exists");
var remove_special_chars_1 = require("../helpers/remove-special-chars");
var GluestackConfig_1 = require("./GluestackConfig");
var HasuraMetadata_1 = __importDefault(require("./HasuraMetadata"));
var GluestackEvent_1 = __importDefault(require("./GluestackEvent"));
var HasuraEngine = (function () {
    function HasuraEngine(actionPlugins) {
        this.actionGQLFile = 'action.graphql';
        this.actionSettingFile = 'action.setting';
        this.actions = [];
        this.pluginName = (0, GluestackConfig_1.getConfig)('hasuraInstancePath');
        this.actionPlugins = actionPlugins;
        this.metadata = new HasuraMetadata_1.default(this.pluginName);
        this.events = new GluestackEvent_1.default(this.pluginName);
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
                        console.log('> Registering actions plugins into hasura engine...');
                        return [4, this.createActionPermissions()];
                    case 5:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.reapplyEvents = function () {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var events, _d, _e, _f, table, e_1_1;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4, this.events.scanEvents()];
                    case 1:
                        _g.sent();
                        console.log('> Dropping & Registering all events from hasura engine...');
                        return [4, this.events.getEventsByType('database')];
                    case 2:
                        events = _g.sent();
                        _g.label = 3;
                    case 3:
                        _g.trys.push([3, 12, 13, 18]);
                        _d = true, _e = __asyncValues(Object.keys(events));
                        _g.label = 4;
                    case 4: return [4, _e.next()];
                    case 5:
                        if (!(_f = _g.sent(), _a = _f.done, !_a)) return [3, 11];
                        _c = _f.value;
                        _d = false;
                        _g.label = 6;
                    case 6:
                        _g.trys.push([6, , 9, 10]);
                        table = _c;
                        return [4, this.metadata.dropEvent(table, events[table])];
                    case 7:
                        _g.sent();
                        return [4, this.metadata.createEvent(table, events[table])];
                    case 8:
                        _g.sent();
                        return [3, 10];
                    case 9:
                        _d = true;
                        return [7];
                    case 10: return [3, 4];
                    case 11: return [3, 18];
                    case 12:
                        e_1_1 = _g.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 18];
                    case 13:
                        _g.trys.push([13, , 16, 17]);
                        if (!(!_d && !_a && (_b = _e.return))) return [3, 15];
                        return [4, _b.call(_e)];
                    case 14:
                        _g.sent();
                        _g.label = 15;
                    case 15: return [3, 17];
                    case 16:
                        if (e_1) throw e_1.error;
                        return [7];
                    case 17: return [7];
                    case 18: return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.applyTracks = function () {
        var _a, e_2, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var backendInstancePath, authInstancePath, tracksPath, dirents, _d, dirents_1, dirents_1_1, dirent, trackPath, track, trackJSON, error_1, e_2_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
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
                        dirents = _e.sent();
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 14, 15, 20]);
                        _d = true, dirents_1 = __asyncValues(dirents);
                        _e.label = 3;
                    case 3: return [4, dirents_1.next()];
                    case 4:
                        if (!(dirents_1_1 = _e.sent(), _a = dirents_1_1.done, !_a)) return [3, 13];
                        _c = dirents_1_1.value;
                        _d = false;
                        _e.label = 5;
                    case 5:
                        _e.trys.push([5, , 11, 12]);
                        dirent = _c;
                        if (!(dirent.isFile() && (0, path_1.extname)(dirent.name).toLowerCase() === '.json')) return [3, 10];
                        trackPath = (0, path_1.join)(tracksPath, dirent.name);
                        _e.label = 6;
                    case 6:
                        _e.trys.push([6, 9, , 10]);
                        return [4, (0, promises_1.readFile)(trackPath)];
                    case 7:
                        track = _e.sent();
                        trackJSON = JSON.parse(track.toString());
                        return [4, this.metadata.tracks(trackJSON)];
                    case 8:
                        _e.sent();
                        return [3, 10];
                    case 9:
                        error_1 = _e.sent();
                        return [3, 12];
                    case 10: return [3, 12];
                    case 11:
                        _d = true;
                        return [7];
                    case 12: return [3, 3];
                    case 13: return [3, 20];
                    case 14:
                        e_2_1 = _e.sent();
                        e_2 = { error: e_2_1 };
                        return [3, 20];
                    case 15:
                        _e.trys.push([15, , 18, 19]);
                        if (!(!_d && !_a && (_b = dirents_1.return))) return [3, 17];
                        return [4, _b.call(dirents_1)];
                    case 16:
                        _e.sent();
                        _e.label = 17;
                    case 17: return [3, 19];
                    case 18:
                        if (e_2) throw e_2.error;
                        return [7];
                    case 19: return [7];
                    case 20: return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.scanActions = function () {
        var _a, e_3, _b, _c, _d, e_4, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            var _g, _h, _j, plugin, exist, dirents, _k, dirents_2, dirents_2_1, dirent, e_4_1, e_3_1;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        _l.trys.push([0, 25, 26, 31]);
                        _g = true, _h = __asyncValues(this.actionPlugins);
                        _l.label = 1;
                    case 1: return [4, _h.next()];
                    case 2:
                        if (!(_j = _l.sent(), _a = _j.done, !_a)) return [3, 24];
                        _c = _j.value;
                        _g = false;
                        _l.label = 3;
                    case 3:
                        _l.trys.push([3, , 22, 23]);
                        plugin = _c;
                        return [4, (0, file_exists_1.fileExists)("".concat(plugin.path, "/actions"))];
                    case 4:
                        exist = _l.sent();
                        if (!exist) {
                            console.log("> Action Instance ".concat(plugin.instance, " is missing. Skipping..."));
                            return [3, 23];
                        }
                        return [4, (0, promises_1.readdir)("".concat(plugin.path, "/actions"), { withFileTypes: true })];
                    case 5:
                        dirents = _l.sent();
                        _l.label = 6;
                    case 6:
                        _l.trys.push([6, 15, 16, 21]);
                        _k = true, dirents_2 = (e_4 = void 0, __asyncValues(dirents));
                        _l.label = 7;
                    case 7: return [4, dirents_2.next()];
                    case 8:
                        if (!(dirents_2_1 = _l.sent(), _d = dirents_2_1.done, !_d)) return [3, 14];
                        _f = dirents_2_1.value;
                        _k = false;
                        _l.label = 9;
                    case 9:
                        _l.trys.push([9, , 12, 13]);
                        dirent = _f;
                        if (!dirent.isDirectory()) return [3, 11];
                        return [4, (0, file_exists_1.fileExists)((0, path_1.join)(plugin.path, "actions", dirent.name, this.actionGQLFile))];
                    case 10:
                        exist = _l.sent();
                        if (!exist) {
                            console.log("> Action Instance ".concat(plugin.instance, " does not have actions.graphql file. Skipping..."));
                            return [3, 13];
                        }
                        this.actions.push({
                            name: (0, remove_special_chars_1.removeSpecialChars)(dirent.name),
                            handler: (0, remove_special_chars_1.removeSpecialChars)(plugin.instance),
                            path: (0, path_1.join)(plugin.path, "actions", dirent.name),
                            grapqhl_path: (0, path_1.join)(plugin.path, "actions", dirent.name, this.actionGQLFile),
                            setting_path: (0, path_1.join)(plugin.path, "actions", dirent.name, this.actionSettingFile)
                        });
                        _l.label = 11;
                    case 11: return [3, 13];
                    case 12:
                        _k = true;
                        return [7];
                    case 13: return [3, 7];
                    case 14: return [3, 21];
                    case 15:
                        e_4_1 = _l.sent();
                        e_4 = { error: e_4_1 };
                        return [3, 21];
                    case 16:
                        _l.trys.push([16, , 19, 20]);
                        if (!(!_k && !_d && (_e = dirents_2.return))) return [3, 18];
                        return [4, _e.call(dirents_2)];
                    case 17:
                        _l.sent();
                        _l.label = 18;
                    case 18: return [3, 20];
                    case 19:
                        if (e_4) throw e_4.error;
                        return [7];
                    case 20: return [7];
                    case 21: return [3, 23];
                    case 22:
                        _g = true;
                        return [7];
                    case 23: return [3, 1];
                    case 24: return [3, 31];
                    case 25:
                        e_3_1 = _l.sent();
                        e_3 = { error: e_3_1 };
                        return [3, 31];
                    case 26:
                        _l.trys.push([26, , 29, 30]);
                        if (!(!_g && !_a && (_b = _h.return))) return [3, 28];
                        return [4, _b.call(_h)];
                    case 27:
                        _l.sent();
                        _l.label = 28;
                    case 28: return [3, 30];
                    case 29:
                        if (e_3) throw e_3.error;
                        return [7];
                    case 30: return [7];
                    case 31: return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.dropActions = function () {
        var _a, e_5, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var _d, _e, _f, action, e_5_1;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (this.actions.length <= 0) {
                            return [2, Promise.resolve(false)];
                        }
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 9, 10, 15]);
                        _d = true, _e = __asyncValues(this.actions);
                        _g.label = 2;
                    case 2: return [4, _e.next()];
                    case 3:
                        if (!(_f = _g.sent(), _a = _f.done, !_a)) return [3, 8];
                        _c = _f.value;
                        _d = false;
                        _g.label = 4;
                    case 4:
                        _g.trys.push([4, , 6, 7]);
                        action = _c;
                        return [4, this.metadata.dropAction(action.name)];
                    case 5:
                        _g.sent();
                        return [3, 7];
                    case 6:
                        _d = true;
                        return [7];
                    case 7: return [3, 2];
                    case 8: return [3, 15];
                    case 9:
                        e_5_1 = _g.sent();
                        e_5 = { error: e_5_1 };
                        return [3, 15];
                    case 10:
                        _g.trys.push([10, , 13, 14]);
                        if (!(!_d && !_a && (_b = _e.return))) return [3, 12];
                        return [4, _b.call(_e)];
                    case 11:
                        _g.sent();
                        _g.label = 12;
                    case 12: return [3, 14];
                    case 13:
                        if (e_5) throw e_5.error;
                        return [7];
                    case 14: return [7];
                    case 15: return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.createActions = function () {
        var _a, e_6, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var _d, _e, _f, action, e_6_1;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (this.actions.length <= 0) {
                            return [2, Promise.resolve(false)];
                        }
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 9, 10, 15]);
                        _d = true, _e = __asyncValues(this.actions);
                        _g.label = 2;
                    case 2: return [4, _e.next()];
                    case 3:
                        if (!(_f = _g.sent(), _a = _f.done, !_a)) return [3, 8];
                        _c = _f.value;
                        _d = false;
                        _g.label = 4;
                    case 4:
                        _g.trys.push([4, , 6, 7]);
                        action = _c;
                        return [4, this.metadata.createAction(action)];
                    case 5:
                        _g.sent();
                        return [3, 7];
                    case 6:
                        _d = true;
                        return [7];
                    case 7: return [3, 2];
                    case 8: return [3, 15];
                    case 9:
                        e_6_1 = _g.sent();
                        e_6 = { error: e_6_1 };
                        return [3, 15];
                    case 10:
                        _g.trys.push([10, , 13, 14]);
                        if (!(!_d && !_a && (_b = _e.return))) return [3, 12];
                        return [4, _b.call(_e)];
                    case 11:
                        _g.sent();
                        _g.label = 12;
                    case 12: return [3, 14];
                    case 13:
                        if (e_6) throw e_6.error;
                        return [7];
                    case 14: return [7];
                    case 15: return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.createActionPermissions = function () {
        var _a, e_7, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var _d, _e, _f, action, e_7_1;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (this.actions.length <= 0) {
                            return [2, Promise.resolve(false)];
                        }
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 9, 10, 15]);
                        _d = true, _e = __asyncValues(this.actions);
                        _g.label = 2;
                    case 2: return [4, _e.next()];
                    case 3:
                        if (!(_f = _g.sent(), _a = _f.done, !_a)) return [3, 8];
                        _c = _f.value;
                        _d = false;
                        _g.label = 4;
                    case 4:
                        _g.trys.push([4, , 6, 7]);
                        action = _c;
                        return [4, this.metadata.createActionPermission(action)];
                    case 5:
                        _g.sent();
                        return [3, 7];
                    case 6:
                        _d = true;
                        return [7];
                    case 7: return [3, 2];
                    case 8: return [3, 15];
                    case 9:
                        e_7_1 = _g.sent();
                        e_7 = { error: e_7_1 };
                        return [3, 15];
                    case 10:
                        _g.trys.push([10, , 13, 14]);
                        if (!(!_d && !_a && (_b = _e.return))) return [3, 12];
                        return [4, _b.call(_e)];
                    case 11:
                        _g.sent();
                        _g.label = 12;
                    case 12: return [3, 14];
                    case 13:
                        if (e_7) throw e_7.error;
                        return [7];
                    case 14: return [7];
                    case 15: return [2];
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
exports.default = HasuraEngine;
//# sourceMappingURL=HasuraEngine.js.map