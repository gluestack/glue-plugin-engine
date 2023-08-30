"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var helpers_1 = require("@gluestack/helpers");
var GluestackConfig_1 = require("./GluestackConfig");
var HasuraMetadata_1 = __importDefault(require("./HasuraMetadata"));
var GluestackEvent_1 = __importDefault(require("./GluestackEvent"));
var HasuraEngine = (function () {
    function HasuraEngine(actionPlugins) {
        this.actionGQLFile = "action.graphql";
        this.actionSettingFile = "action.setting";
        this.actionYamlFile = "action.yaml";
        this.actions = [];
        this.payload = {
            resource_version: 509,
            metadata: {
                version: 2,
                sources: [],
                actions: [],
                custom_types: {},
            },
        };
        this.pluginName = (0, GluestackConfig_1.getConfig)("hasuraInstancePath");
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
                        filepath = (0, path_1.join)(process.cwd(), (0, GluestackConfig_1.getConfig)("backendInstancePath"), "services", this.pluginName);
                        return [4, (0, spawn_1.execute)("hasura", [
                                "metadata",
                                "export",
                                "--envfile",
                                ".env.generated",
                                "--skip-update-check",
                            ], {
                                cwd: filepath,
                                stdio: "inherit",
                                shell: true,
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
                        filepath = (0, path_1.join)(process.cwd(), (0, GluestackConfig_1.getConfig)("backendInstancePath"), "services", this.pluginName);
                        return [4, (0, spawn_1.execute)("hasura", [
                                "metadata",
                                "apply",
                                "--envfile",
                                ".env.generated",
                                "--skip-update-check",
                            ], {
                                cwd: filepath,
                                stdio: "inherit",
                                shell: true,
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
                    case 0: return [4, this.applyMetadata()];
                    case 1:
                        _a.sent();
                        hasuraEnvs = this.metadata.hasuraEnvs;
                        filepath = (0, path_1.join)(process.cwd(), (0, GluestackConfig_1.getConfig)("backendInstancePath"), "services", this.pluginName);
                        return [4, (0, spawn_1.execute)("hasura", [
                                "migrate",
                                "apply",
                                "--database-name",
                                hasuraEnvs.HASURA_GRAPHQL_DB_NAME,
                                "--envfile",
                                ".env.generated",
                                "--skip-update-check",
                            ], {
                                cwd: filepath,
                                stdio: "inherit",
                                shell: true,
                            })];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.applySeed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hasuraEnvs, filepath, sqlsPath, files;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hasuraEnvs = this.metadata.hasuraEnvs;
                        filepath = (0, path_1.join)(process.cwd(), (0, GluestackConfig_1.getConfig)("backendInstancePath"), "services", this.pluginName);
                        sqlsPath = (0, path_1.join)(filepath, "seeds", hasuraEnvs.HASURA_GRAPHQL_DB_NAME);
                        return [4, (0, helpers_1.fileExists)(sqlsPath)];
                    case 1:
                        if (!(_a.sent())) {
                            return [2];
                        }
                        return [4, (0, helpers_1.getFiles)(sqlsPath)];
                    case 2:
                        files = _a.sent();
                        if (!files || files.length === 0) {
                            return [2];
                        }
                        return [4, (0, spawn_1.execute)("hasura", [
                                "seed",
                                "apply",
                                "--database-name",
                                hasuraEnvs.HASURA_GRAPHQL_DB_NAME,
                                "--envfile",
                                ".env.generated",
                                "--skip-update-check",
                            ], {
                                cwd: filepath,
                                stdio: "inherit",
                                shell: true,
                            })];
                    case 3:
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
                        console.log("\n> Scanning for actions plugins...");
                        return [4, this.scanActions()];
                    case 1:
                        _a.sent();
                        return [4, this.getMetadata()];
                    case 2:
                        _a.sent();
                        console.log("> Creating all custom types for actions...");
                        return [4, this.createCustomTypes()];
                    case 3:
                        _a.sent();
                        console.log("> Preparing actions & their permissions...");
                        return [4, this.createActions()];
                    case 4:
                        _a.sent();
                        console.log("> Registering actions & their permissions...");
                        return [4, this.replaceMetadata()];
                    case 5:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.getMetadata = function () {
        return __awaiter(this, void 0, void 0, function () {
            var metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.metadata.makeRequest({
                            type: "export_metadata",
                            version: 2,
                            args: {},
                        })];
                    case 1:
                        metadata = _a.sent();
                        this.payload.resource_version = metadata.data.resource_version;
                        this.payload.metadata.version = metadata.data.metadata.version;
                        this.payload.metadata.sources = metadata.data.metadata.sources;
                        this.payload.metadata.actions = [];
                        this.payload.metadata.custom_types = {};
                        return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.replaceMetadata = function () {
        var _a, e_1, _b, _c;
        var _d;
        return __awaiter(this, void 0, void 0, function () {
            var response, inconsistentObjects, head, rows, _e, inconsistentObjects_1, inconsistentObjects_1_1, inconsistentObject, e_1_1;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4, this.metadata.makeRequest({
                            type: "replace_metadata",
                            version: 2,
                            args: {
                                allow_inconsistent_metadata: true,
                                allow_warnings: true,
                                metadata: this.payload.metadata,
                            },
                        }, true)];
                    case 1:
                        response = _f.sent();
                        inconsistentObjects = ((_d = response === null || response === void 0 ? void 0 : response.data) === null || _d === void 0 ? void 0 : _d.inconsistent_objects) || [];
                        if (!(inconsistentObjects.length > 0)) return [3, 15];
                        console.log("> Some inconsistent objects found in the hasura engine...");
                        head = ["Type", "Name", "Reason"];
                        rows = [];
                        _f.label = 2;
                    case 2:
                        _f.trys.push([2, 7, 8, 13]);
                        _e = true, inconsistentObjects_1 = __asyncValues(inconsistentObjects);
                        _f.label = 3;
                    case 3: return [4, inconsistentObjects_1.next()];
                    case 4:
                        if (!(inconsistentObjects_1_1 = _f.sent(), _a = inconsistentObjects_1_1.done, !_a)) return [3, 6];
                        _c = inconsistentObjects_1_1.value;
                        _e = false;
                        try {
                            inconsistentObject = _c;
                            rows.push([
                                inconsistentObject.type || "NA",
                                inconsistentObject.name || "NA",
                                inconsistentObject.reason || "NA",
                            ]);
                        }
                        finally {
                            _e = true;
                        }
                        _f.label = 5;
                    case 5: return [3, 3];
                    case 6: return [3, 13];
                    case 7:
                        e_1_1 = _f.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 13];
                    case 8:
                        _f.trys.push([8, , 11, 12]);
                        if (!(!_e && !_a && (_b = inconsistentObjects_1.return))) return [3, 10];
                        return [4, _b.call(inconsistentObjects_1)];
                    case 9:
                        _f.sent();
                        _f.label = 10;
                    case 10: return [3, 12];
                    case 11:
                        if (e_1) throw e_1.error;
                        return [7];
                    case 12: return [7];
                    case 13: return [4, helpers_1.ConsoleTable.print(head, rows)];
                    case 14:
                        _f.sent();
                        process.exit(1);
                        _f.label = 15;
                    case 15: return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.reapplyEvents = function () {
        var _a, e_2, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var events, _d, _e, _f, table, e_2_1;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4, this.events.scanEvents()];
                    case 1:
                        _g.sent();
                        console.log("> Dropping & Registering all events from hasura engine...");
                        return [4, this.events.getEventsByType("database")];
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
                        e_2_1 = _g.sent();
                        e_2 = { error: e_2_1 };
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
                        if (e_2) throw e_2.error;
                        return [7];
                    case 17: return [7];
                    case 18: return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.applyTracks = function () {
        var _a, e_3, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var backendInstancePath, authInstancePath, tracksPath, dirents, _d, dirents_1, dirents_1_1, dirent, trackPath, track, trackJSON, error_1, e_3_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        console.log("> Scanning tracks directory...");
                        backendInstancePath = (0, GluestackConfig_1.getConfig)("backendInstancePath");
                        authInstancePath = (0, GluestackConfig_1.getConfig)("authInstancePath");
                        if (!authInstancePath || authInstancePath === "") {
                            return [2, Promise.resolve("No auth instance path found")];
                        }
                        tracksPath = (0, path_1.join)(process.cwd(), backendInstancePath, "services", this.pluginName, "tracks");
                        return [4, (0, helpers_1.fileExists)(tracksPath)];
                    case 1:
                        if (!(_e.sent())) {
                            console.log("> Nothing to track into hasura engine...");
                            return [2, Promise.resolve("No tracks folder found. Skipping...")];
                        }
                        console.log("> Applying all tracks into hasura engine...");
                        return [4, (0, promises_1.readdir)(tracksPath, { withFileTypes: true })];
                    case 2:
                        dirents = _e.sent();
                        _e.label = 3;
                    case 3:
                        _e.trys.push([3, 15, 16, 21]);
                        _d = true, dirents_1 = __asyncValues(dirents);
                        _e.label = 4;
                    case 4: return [4, dirents_1.next()];
                    case 5:
                        if (!(dirents_1_1 = _e.sent(), _a = dirents_1_1.done, !_a)) return [3, 14];
                        _c = dirents_1_1.value;
                        _d = false;
                        _e.label = 6;
                    case 6:
                        _e.trys.push([6, , 12, 13]);
                        dirent = _c;
                        if (!(dirent.isFile() && (0, path_1.extname)(dirent.name).toLowerCase() === ".json")) return [3, 11];
                        trackPath = (0, path_1.join)(tracksPath, dirent.name);
                        _e.label = 7;
                    case 7:
                        _e.trys.push([7, 10, , 11]);
                        return [4, (0, promises_1.readFile)(trackPath)];
                    case 8:
                        track = _e.sent();
                        trackJSON = JSON.parse(track.toString());
                        return [4, this.metadata.tracks(trackJSON)];
                    case 9:
                        _e.sent();
                        return [3, 11];
                    case 10:
                        error_1 = _e.sent();
                        return [3, 13];
                    case 11: return [3, 13];
                    case 12:
                        _d = true;
                        return [7];
                    case 13: return [3, 4];
                    case 14: return [3, 21];
                    case 15:
                        e_3_1 = _e.sent();
                        e_3 = { error: e_3_1 };
                        return [3, 21];
                    case 16:
                        _e.trys.push([16, , 19, 20]);
                        if (!(!_d && !_a && (_b = dirents_1.return))) return [3, 18];
                        return [4, _b.call(dirents_1)];
                    case 17:
                        _e.sent();
                        _e.label = 18;
                    case 18: return [3, 20];
                    case 19:
                        if (e_3) throw e_3.error;
                        return [7];
                    case 20: return [7];
                    case 21: return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.scanActions = function () {
        var _a, e_4, _b, _c, _d, e_5, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            var _g, _h, _j, plugin, functionsDirectory, exist, dirents, _k, dirents_2, dirents_2_1, dirent, actionGQLFile, actionSettingFile, actionYamlFile, _l, _m, _o, _p, e_5_1, e_4_1;
            var _q;
            return __generator(this, function (_r) {
                switch (_r.label) {
                    case 0:
                        _r.trys.push([0, 29, 30, 35]);
                        _g = true, _h = __asyncValues(this.actionPlugins);
                        _r.label = 1;
                    case 1: return [4, _h.next()];
                    case 2:
                        if (!(_j = _r.sent(), _a = _j.done, !_a)) return [3, 28];
                        _c = _j.value;
                        _g = false;
                        _r.label = 3;
                    case 3:
                        _r.trys.push([3, , 26, 27]);
                        plugin = _c;
                        functionsDirectory = (0, path_1.join)(plugin.path, "functions");
                        return [4, (0, helpers_1.fileExists)(functionsDirectory)];
                    case 4:
                        exist = _r.sent();
                        if (!exist) {
                            console.log("> Action Instance ".concat(plugin.instance, " is missing. Skipping..."));
                            return [3, 27];
                        }
                        return [4, (0, promises_1.readdir)(functionsDirectory, {
                                withFileTypes: true,
                            })];
                    case 5:
                        dirents = _r.sent();
                        _r.label = 6;
                    case 6:
                        _r.trys.push([6, 19, 20, 25]);
                        _k = true, dirents_2 = (e_5 = void 0, __asyncValues(dirents));
                        _r.label = 7;
                    case 7: return [4, dirents_2.next()];
                    case 8:
                        if (!(dirents_2_1 = _r.sent(), _d = dirents_2_1.done, !_d)) return [3, 18];
                        _f = dirents_2_1.value;
                        _k = false;
                        _r.label = 9;
                    case 9:
                        _r.trys.push([9, , 16, 17]);
                        dirent = _f;
                        actionGQLFile = (0, path_1.join)(functionsDirectory, dirent.name, this.actionGQLFile);
                        actionSettingFile = (0, path_1.join)(functionsDirectory, dirent.name, this.actionSettingFile);
                        actionYamlFile = (0, path_1.join)(functionsDirectory, dirent.name, this.actionYamlFile);
                        _m = dirent.isDirectory();
                        if (!_m) return [3, 11];
                        return [4, (0, helpers_1.fileExists)(actionGQLFile)];
                    case 10:
                        _m = (_r.sent());
                        _r.label = 11;
                    case 11:
                        _l = _m;
                        if (!_l) return [3, 13];
                        return [4, (0, helpers_1.fileExists)(actionSettingFile)];
                    case 12:
                        _l = (_r.sent());
                        _r.label = 13;
                    case 13:
                        if (!_l) return [3, 15];
                        _p = (_o = this.actions).push;
                        _q = {
                            name: (0, helpers_1.removeSpecialChars)(dirent.name),
                            handler: (0, helpers_1.removeSpecialChars)(plugin.instance),
                            path: (0, path_1.join)(functionsDirectory, dirent.name),
                            grapqhl_path: actionGQLFile,
                            setting_path: actionSettingFile
                        };
                        return [4, (0, helpers_1.fileExists)(actionYamlFile)];
                    case 14:
                        _p.apply(_o, [(_q.yaml_path = (_r.sent())
                                ? actionYamlFile
                                : null,
                                _q)]);
                        _r.label = 15;
                    case 15: return [3, 17];
                    case 16:
                        _k = true;
                        return [7];
                    case 17: return [3, 7];
                    case 18: return [3, 25];
                    case 19:
                        e_5_1 = _r.sent();
                        e_5 = { error: e_5_1 };
                        return [3, 25];
                    case 20:
                        _r.trys.push([20, , 23, 24]);
                        if (!(!_k && !_d && (_e = dirents_2.return))) return [3, 22];
                        return [4, _e.call(dirents_2)];
                    case 21:
                        _r.sent();
                        _r.label = 22;
                    case 22: return [3, 24];
                    case 23:
                        if (e_5) throw e_5.error;
                        return [7];
                    case 24: return [7];
                    case 25: return [3, 27];
                    case 26:
                        _g = true;
                        return [7];
                    case 27: return [3, 1];
                    case 28: return [3, 35];
                    case 29:
                        e_4_1 = _r.sent();
                        e_4 = { error: e_4_1 };
                        return [3, 35];
                    case 30:
                        _r.trys.push([30, , 33, 34]);
                        if (!(!_g && !_a && (_b = _h.return))) return [3, 32];
                        return [4, _b.call(_h)];
                    case 31:
                        _r.sent();
                        _r.label = 32;
                    case 32: return [3, 34];
                    case 33:
                        if (e_4) throw e_4.error;
                        return [7];
                    case 34: return [7];
                    case 35: return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.createActions = function () {
        var _a, e_6, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var _d, _e, _f, action, permissions, _action, _permissions, _i, _permissions_1, _permission, e_6_1;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (this.actions.length <= 0) {
                            return [2, Promise.resolve(false)];
                        }
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 10, 11, 16]);
                        _d = true, _e = __asyncValues(this.actions);
                        _g.label = 2;
                    case 2: return [4, _e.next()];
                    case 3:
                        if (!(_f = _g.sent(), _a = _f.done, !_a)) return [3, 9];
                        _c = _f.value;
                        _d = false;
                        _g.label = 4;
                    case 4:
                        _g.trys.push([4, , 7, 8]);
                        action = _c;
                        permissions = [];
                        return [4, this.metadata.createAction(action)];
                    case 5:
                        _action = _g.sent();
                        return [4, this.metadata.createActionPermission(action)];
                    case 6:
                        _permissions = _g.sent();
                        if (_permissions) {
                            for (_i = 0, _permissions_1 = _permissions; _i < _permissions_1.length; _i++) {
                                _permission = _permissions_1[_i];
                                permissions.push({ role: _permission.args.role });
                            }
                        }
                        this.payload.metadata.actions.push(__assign(__assign({}, _action.args), { permissions: permissions }));
                        return [3, 8];
                    case 7:
                        _d = true;
                        return [7];
                    case 8: return [3, 2];
                    case 9: return [3, 16];
                    case 10:
                        e_6_1 = _g.sent();
                        e_6 = { error: e_6_1 };
                        return [3, 16];
                    case 11:
                        _g.trys.push([11, , 14, 15]);
                        if (!(!_d && !_a && (_b = _e.return))) return [3, 13];
                        return [4, _b.call(_e)];
                    case 12:
                        _g.sent();
                        _g.label = 13;
                    case 13: return [3, 15];
                    case 14:
                        if (e_6) throw e_6.error;
                        return [7];
                    case 15: return [7];
                    case 16: return [2];
                }
            });
        });
    };
    HasuraEngine.prototype.createCustomTypes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.actions.length <= 0) {
                            return [2, Promise.resolve(false)];
                        }
                        _a = this.payload.metadata;
                        return [4, this.metadata.createCustomTypes(this.actions)];
                    case 1:
                        _a.custom_types = _b.sent();
                        return [2];
                }
            });
        });
    };
    return HasuraEngine;
}());
exports.default = HasuraEngine;
//# sourceMappingURL=HasuraEngine.js.map