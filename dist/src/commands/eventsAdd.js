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
exports.createContent = exports.create = exports.eventsAdd = void 0;
var write_file_1 = require("../helpers/write-file");
var create_folder_1 = require("../helpers/create-folder");
var file_exists_1 = require("../helpers/file-exists");
var fs = require('fs');
var path = require('path');
function eventsAdd(program, glueStackPlugin) {
    var command = program
        .command("events:add")
        .option('--t, --table <table-name>', 'name of the table in database (table-name:event1,event2)', function (tableName) {
        var folderName = tableName.split(':')[0];
        var match = tableName.match(new RegExp("".concat(folderName, ":((\\w+,)*\\w+)")));
        if (!match) {
            return [];
        }
        match = match[1].split(',');
        match.unshift(folderName);
        return match;
    })
        .option('--f, --function <function-name>', 'name of function')
        .option('--w, --webhook <webhook-url>', 'webhook url')
        .option('--a, --app <app-name>', 'name of the event')
        .description("Create the events")
        .action(function (args) { return create(glueStackPlugin, args); });
}
exports.eventsAdd = eventsAdd;
function create(glueStackPlugin, args) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var fileContent, content, dbEventPath, appEventPath, _d, _e, _f, element, dbEventFilePath, data, error_1, e_1_1, appEventFilePath, data, error_2;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    dbEventPath = './backend/events/database';
                    appEventPath = './backend/events/app';
                    if ('function' in args && 'webhook' in args) {
                        console.log("please give either --f function or --w webhook-url");
                        return [2];
                    }
                    if ('table' in args && 'app' in args) {
                        console.log("please give either table or an app");
                        return [2];
                    }
                    if (!args.hasOwnProperty('function')) return [3, 2];
                    return [4, createContent('function', args === null || args === void 0 ? void 0 : args["function"])];
                case 1:
                    content = _g.sent();
                    _g.label = 2;
                case 2:
                    if (!args.hasOwnProperty('webhook')) return [3, 4];
                    return [4, createContent('webhook', args === null || args === void 0 ? void 0 : args.webhook)];
                case 3:
                    content = _g.sent();
                    _g.label = 4;
                case 4:
                    if (!args.hasOwnProperty('table')) return [3, 24];
                    return [4, (0, create_folder_1.createFolder)("".concat(dbEventPath, "/").concat(args === null || args === void 0 ? void 0 : args.table[0]))];
                case 5:
                    _g.sent();
                    _g.label = 6;
                case 6:
                    _g.trys.push([6, 18, 19, 24]);
                    _d = true, _e = __asyncValues(args.table.slice(1));
                    _g.label = 7;
                case 7: return [4, _e.next()];
                case 8:
                    if (!(_f = _g.sent(), _a = _f.done, !_a)) return [3, 17];
                    _c = _f.value;
                    _d = false;
                    _g.label = 9;
                case 9:
                    _g.trys.push([9, , 15, 16]);
                    element = _c;
                    _g.label = 10;
                case 10:
                    _g.trys.push([10, 13, , 14]);
                    return [4, (0, file_exists_1.fileExists)("".concat(dbEventPath, "/").concat(args === null || args === void 0 ? void 0 : args.table[0], "/").concat(element, ".js"))];
                case 11:
                    if (_g.sent()) {
                        dbEventFilePath = path.join(process.cwd(), dbEventPath.slice(2), "".concat(args === null || args === void 0 ? void 0 : args.table[0], "/").concat(element, ".js"));
                        data = require(dbEventFilePath);
                        data.push(content);
                        fileContent = "module.exports = ".concat(JSON.stringify(data, null, 2));
                    }
                    else {
                        fileContent = "module.exports = [".concat(JSON.stringify(content, null, 2), "]");
                    }
                    return [4, (0, write_file_1.writeFile)("".concat(dbEventPath, "/").concat(args === null || args === void 0 ? void 0 : args.table[0], "/").concat(element, ".js"), fileContent)];
                case 12:
                    _g.sent();
                    return [3, 14];
                case 13:
                    error_1 = _g.sent();
                    console.log(error_1);
                    return [3, 14];
                case 14: return [3, 16];
                case 15:
                    _d = true;
                    return [7];
                case 16: return [3, 7];
                case 17: return [3, 24];
                case 18:
                    e_1_1 = _g.sent();
                    e_1 = { error: e_1_1 };
                    return [3, 24];
                case 19:
                    _g.trys.push([19, , 22, 23]);
                    if (!(!_d && !_a && (_b = _e["return"]))) return [3, 21];
                    return [4, _b.call(_e)];
                case 20:
                    _g.sent();
                    _g.label = 21;
                case 21: return [3, 23];
                case 22:
                    if (e_1) throw e_1.error;
                    return [7];
                case 23: return [7];
                case 24:
                    if (!args.hasOwnProperty('app')) return [3, 29];
                    _g.label = 25;
                case 25:
                    _g.trys.push([25, 28, , 29]);
                    return [4, (0, file_exists_1.fileExists)("".concat(appEventPath, "/").concat(args === null || args === void 0 ? void 0 : args.app, ".js"))];
                case 26:
                    if (_g.sent()) {
                        appEventFilePath = path.join(process.cwd(), appEventPath.slice(2), args === null || args === void 0 ? void 0 : args.app);
                        data = require(appEventFilePath);
                        data.push(content);
                        fileContent = "module.exports = ".concat(JSON.stringify(data, null, 2));
                    }
                    else {
                        fileContent = "module.exports = [".concat(JSON.stringify(content, null, 2), "]");
                    }
                    return [4, (0, write_file_1.writeFile)("".concat(appEventPath, "/").concat(args === null || args === void 0 ? void 0 : args.app, ".js"), fileContent)];
                case 27:
                    _g.sent();
                    return [3, 29];
                case 28:
                    error_2 = _g.sent();
                    console.log(error_2);
                    return [3, 29];
                case 29: return [2];
            }
        });
    });
}
exports.create = create;
function createContent(type, value) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, {
                    kind: "sync",
                    type: type,
                    value: value
                }];
        });
    });
}
exports.createContent = createContent;
module.exports = { eventsAdd: eventsAdd };
//# sourceMappingURL=eventsAdd.js.map