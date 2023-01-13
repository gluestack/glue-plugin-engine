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
exports.__esModule = true;
var path_1 = require("path");
var promises_1 = require("node:fs/promises");
var file_exists_1 = require("../helpers/file-exists");
var GluestackConfig_1 = require("./GluestackConfig");
var GluestackEvent = (function () {
    function GluestackEvent(hasuraPluginName) {
        this.events = {};
        this.events = {};
        this.hasuraPluginName = hasuraPluginName;
        this.eventsPath = (0, path_1.join)((0, GluestackConfig_1.getConfig)('backendInstancePath'), 'events');
    }
    GluestackEvent.prototype.scanEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this.events;
                        _b = 'database';
                        return [4, this.readEventsDir('database', true)];
                    case 1:
                        _a[_b] = _e.sent();
                        _c = this.events;
                        _d = 'app';
                        return [4, this.readEventsDir('app', false)];
                    case 2:
                        _c[_d] = _e.sent();
                        return [4, this.prepareConfigJSON()];
                    case 3:
                        _e.sent();
                        return [2];
                }
            });
        });
    };
    GluestackEvent.prototype.getEventsByType = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.events[type]];
            });
        });
    };
    GluestackEvent.prototype.readEventsDir = function (dirName, readDirectory) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var paths, dirPath, exist, dirents, dirents_1, dirents_1_1, dirent, _b, _c, e_1_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        paths = readDirectory ? {} : [];
                        dirPath = (0, path_1.join)(this.eventsPath, dirName);
                        return [4, (0, file_exists_1.fileExists)(dirPath)];
                    case 1:
                        exist = _d.sent();
                        if (!exist) {
                            console.log("> \"".concat(dirName, "\" directory does not exist in \"events\" directory. Skipping..."));
                            return [2];
                        }
                        return [4, (0, promises_1.readdir)(dirPath, {
                                withFileTypes: true
                            })];
                    case 2:
                        dirents = _d.sent();
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 10, 11, 16]);
                        dirents_1 = __asyncValues(dirents);
                        _d.label = 4;
                    case 4: return [4, dirents_1.next()];
                    case 5:
                        if (!(dirents_1_1 = _d.sent(), !dirents_1_1.done)) return [3, 9];
                        dirent = dirents_1_1.value;
                        if ((readDirectory && !dirent.isDirectory())
                            || (!readDirectory && dirent.isDirectory())) {
                            return [3, 8];
                        }
                        if (!readDirectory) return [3, 7];
                        _b = paths;
                        _c = dirent.name;
                        return [4, this.readEventsDir((0, path_1.join)(dirName, dirent.name), false)];
                    case 6:
                        _b[_c] = _d.sent();
                        _d.label = 7;
                    case 7:
                        if (!readDirectory) {
                            paths.push(dirent.name.replace('.js', ''));
                        }
                        _d.label = 8;
                    case 8: return [3, 4];
                    case 9: return [3, 16];
                    case 10:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 16];
                    case 11:
                        _d.trys.push([11, , 14, 15]);
                        if (!(dirents_1_1 && !dirents_1_1.done && (_a = dirents_1["return"]))) return [3, 13];
                        return [4, _a.call(dirents_1)];
                    case 12:
                        _d.sent();
                        _d.label = 13;
                    case 13: return [3, 15];
                    case 14:
                        if (e_1) throw e_1.error;
                        return [7];
                    case 15: return [7];
                    case 16: return [2, paths];
                }
            });
        });
    };
    GluestackEvent.prototype.prepareConfigJSON = function () {
        var e_2, _a, e_3, _b, e_4, _c;
        return __awaiter(this, void 0, void 0, function () {
            var events, app, database, content, backendInstance, _d, _e, table, _f, _g, event_1, filepath, e_3_1, e_2_1, app_1, app_1_1, event_2, filepath, e_4_1;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        events = this.events;
                        app = events.app, database = events.database;
                        content = {
                            database: {},
                            app: {}
                        };
                        backendInstance = (0, GluestackConfig_1.getConfig)('backendInstancePath');
                        _h.label = 1;
                    case 1:
                        _h.trys.push([1, 17, 18, 23]);
                        _d = __asyncValues(Object.keys(database));
                        _h.label = 2;
                    case 2: return [4, _d.next()];
                    case 3:
                        if (!(_e = _h.sent(), !_e.done)) return [3, 16];
                        table = _e.value;
                        content.database[table] = {};
                        _h.label = 4;
                    case 4:
                        _h.trys.push([4, 9, 10, 15]);
                        _f = (e_3 = void 0, __asyncValues(database[table]));
                        _h.label = 5;
                    case 5: return [4, _f.next()];
                    case 6:
                        if (!(_g = _h.sent(), !_g.done)) return [3, 8];
                        event_1 = _g.value;
                        filepath = (0, path_1.join)(process.cwd(), backendInstance, 'events', 'database', table, event_1 + '.js');
                        try {
                            content.database[table][event_1] = require(filepath)();
                        }
                        catch (e) {
                            return [3, 7];
                        }
                        _h.label = 7;
                    case 7: return [3, 5];
                    case 8: return [3, 15];
                    case 9:
                        e_3_1 = _h.sent();
                        e_3 = { error: e_3_1 };
                        return [3, 15];
                    case 10:
                        _h.trys.push([10, , 13, 14]);
                        if (!(_g && !_g.done && (_b = _f["return"]))) return [3, 12];
                        return [4, _b.call(_f)];
                    case 11:
                        _h.sent();
                        _h.label = 12;
                    case 12: return [3, 14];
                    case 13:
                        if (e_3) throw e_3.error;
                        return [7];
                    case 14: return [7];
                    case 15: return [3, 2];
                    case 16: return [3, 23];
                    case 17:
                        e_2_1 = _h.sent();
                        e_2 = { error: e_2_1 };
                        return [3, 23];
                    case 18:
                        _h.trys.push([18, , 21, 22]);
                        if (!(_e && !_e.done && (_a = _d["return"]))) return [3, 20];
                        return [4, _a.call(_d)];
                    case 19:
                        _h.sent();
                        _h.label = 20;
                    case 20: return [3, 22];
                    case 21:
                        if (e_2) throw e_2.error;
                        return [7];
                    case 22: return [7];
                    case 23:
                        _h.trys.push([23, 28, 29, 34]);
                        app_1 = __asyncValues(app);
                        _h.label = 24;
                    case 24: return [4, app_1.next()];
                    case 25:
                        if (!(app_1_1 = _h.sent(), !app_1_1.done)) return [3, 27];
                        event_2 = app_1_1.value;
                        filepath = (0, path_1.join)(process.cwd(), backendInstance, 'events', 'app', event_2 + '.js');
                        try {
                            content.app[event_2] = require(filepath)();
                        }
                        catch (e) {
                            return [3, 26];
                        }
                        _h.label = 26;
                    case 26: return [3, 24];
                    case 27: return [3, 34];
                    case 28:
                        e_4_1 = _h.sent();
                        e_4 = { error: e_4_1 };
                        return [3, 34];
                    case 29:
                        _h.trys.push([29, , 32, 33]);
                        if (!(app_1_1 && !app_1_1.done && (_c = app_1["return"]))) return [3, 31];
                        return [4, _c.call(app_1)];
                    case 30:
                        _h.sent();
                        _h.label = 31;
                    case 31: return [3, 33];
                    case 32:
                        if (e_4) throw e_4.error;
                        return [7];
                    case 33: return [7];
                    case 34: return [4, (0, GluestackConfig_1.prepareConfigJSON)(content)];
                    case 35:
                        _h.sent();
                        return [2];
                }
            });
        });
    };
    return GluestackEvent;
}());
exports["default"] = GluestackEvent;
//# sourceMappingURL=GluestackEvent.js.map