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
exports.list = exports.eventsList = void 0;
var fs_1 = __importDefault(require("fs"));
var promises_1 = __importDefault(require("fs/promises"));
var path_1 = __importDefault(require("path"));
var cli_table3_1 = __importDefault(require("cli-table3"));
var colors = require("colors");
function eventsList(program, glueStackPlugin) {
    program
        .command("events:list")
        .option("--all", "list all the events")
        .option("--app", "list all app events")
        .option("--database", "list all database events")
        .description("List the events")
        .action(function (args) { return list(glueStackPlugin, args); });
}
exports.eventsList = eventsList;
function list(_glueStackPlugin, args) {
    return __awaiter(this, void 0, void 0, function () {
        var dbEventPath, appEventPath, table, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    dbEventPath = "./backend/events/database";
                    appEventPath = "./backend/events/app";
                    table = new cli_table3_1.default({
                        head: [
                            colors.brightGreen("Filepath"),
                            colors.brightGreen("Functions"),
                            colors.brightGreen("Webhooks"),
                        ],
                    });
                    _a = true;
                    switch (_a) {
                        case args.hasOwnProperty("all") || Object.entries(args).length === 0: return [3, 1];
                        case args.hasOwnProperty("app"): return [3, 4];
                        case args.hasOwnProperty("database"): return [3, 6];
                    }
                    return [3, 8];
                case 1: return [4, getEvents(appEventPath, table, false)];
                case 2:
                    _b.sent();
                    return [4, getEvents(dbEventPath, table, false)];
                case 3:
                    _b.sent();
                    console.log(table.toString());
                    return [3, 8];
                case 4: return [4, getEvents(appEventPath, table, false)];
                case 5:
                    _b.sent();
                    console.log(table.toString());
                    return [3, 8];
                case 6: return [4, getEvents(dbEventPath, table, false)];
                case 7:
                    _b.sent();
                    console.log(table.toString());
                    return [3, 8];
                case 8: return [2];
            }
        });
    });
}
exports.list = list;
function getEvents(eventPath, table, dbEvent) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var files, listData, _d, files_1, files_1_1, file, eventFilePath, isDir, _e, eventFilePath_1, data, allFunction, allWebhooks, e_1_1, error_1;
        var _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4, getFiles(eventPath)];
                case 1:
                    files = _g.sent();
                    _g.label = 2;
                case 2:
                    _g.trys.push([2, 24, , 25]);
                    _g.label = 3;
                case 3:
                    _g.trys.push([3, 17, 18, 23]);
                    _d = true, files_1 = __asyncValues(files);
                    _g.label = 4;
                case 4: return [4, files_1.next()];
                case 5:
                    if (!(files_1_1 = _g.sent(), _a = files_1_1.done, !_a)) return [3, 16];
                    _c = files_1_1.value;
                    _d = false;
                    _g.label = 6;
                case 6:
                    _g.trys.push([6, , 14, 15]);
                    file = _c;
                    eventFilePath = void 0;
                    if (!dbEvent) {
                        eventFilePath = path_1.default.join(process.cwd(), eventPath.slice(2), file);
                    }
                    else {
                        eventFilePath = eventPath;
                    }
                    if (!dbEvent) return [3, 7];
                    _e = false;
                    return [3, 9];
                case 7: return [4, isDirectory(eventFilePath)];
                case 8:
                    _e = _g.sent();
                    _g.label = 9;
                case 9:
                    isDir = _e;
                    if (!!isDir) return [3, 11];
                    eventFilePath_1 = dbEvent
                        ? path_1.default.join(eventPath, file)
                        : path_1.default.join(process.cwd(), eventPath.slice(2), file);
                    data = require(eventFilePath_1);
                    listData = {
                        fileName: dbEvent
                            ? eventFilePath_1.split("/").slice(-3).join("/")
                            : eventFilePath_1.split("/").slice(-2).join("/"),
                        event: {
                            fun: [],
                            webhook: [],
                        },
                    };
                    return [4, data.map(function (events) {
                            if (events.type === "function") {
                                listData.event.fun.push(events.value);
                            }
                            if (events.type === "webhook") {
                                listData.event.webhook.push(events.value);
                            }
                        })];
                case 10:
                    _g.sent();
                    allFunction = listData.event.fun.join("\n");
                    allWebhooks = listData.event.webhook.join("\n");
                    table.push((_f = {}, _f[listData.fileName] = [allFunction, allWebhooks], _f));
                    return [3, 13];
                case 11: return [4, getEvents(eventFilePath, table, true)];
                case 12:
                    _g.sent();
                    _g.label = 13;
                case 13: return [3, 15];
                case 14:
                    _d = true;
                    return [7];
                case 15: return [3, 4];
                case 16: return [3, 23];
                case 17:
                    e_1_1 = _g.sent();
                    e_1 = { error: e_1_1 };
                    return [3, 23];
                case 18:
                    _g.trys.push([18, , 21, 22]);
                    if (!(!_d && !_a && (_b = files_1.return))) return [3, 20];
                    return [4, _b.call(files_1)];
                case 19:
                    _g.sent();
                    _g.label = 20;
                case 20: return [3, 22];
                case 21:
                    if (e_1) throw e_1.error;
                    return [7];
                case 22: return [7];
                case 23: return [3, 25];
                case 24:
                    error_1 = _g.sent();
                    console.log(error_1);
                    return [3, 25];
                case 25: return [2];
            }
        });
    });
}
function getFiles(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    fs_1.default.readdir(filePath, function (err, files) {
                        if (err) {
                            console.log("> No files found");
                            process.exit(0);
                        }
                        return resolve(files);
                    });
                })];
        });
    });
}
function isDirectory(path) {
    return __awaiter(this, void 0, void 0, function () {
        var data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, promises_1.default.lstat(path)];
                case 1:
                    data = _a.sent();
                    if (data.isDirectory()) {
                        return [2, true];
                    }
                    else {
                        return [2, false];
                    }
                    return [3, 3];
                case 2:
                    error_2 = _a.sent();
                    console.log(error_2);
                    process.exit(0);
                    return [3, 3];
                case 3: return [2];
            }
        });
    });
}
module.exports = { eventsList: eventsList };
//# sourceMappingURL=event-list.js.map