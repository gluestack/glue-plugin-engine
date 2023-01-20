"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.__esModule = true;
exports.createContent = exports.create = exports.cronsAdd = void 0;
var write_file_1 = require("../helpers/write-file");
var file_exists_1 = require("../helpers/file-exists");
var cron = __importStar(require("node-cron"));
var fs = require('fs');
var path = require('path');
function cronsAdd(program, glueStackPlugin) {
    var command = program
        .command("crons:add")
        .option('--s, --schedule <special>', 'schedule value')
        .option('--f, --function <function-name>', 'name of function')
        .option('--w, --webhook <webhook-url>', 'webhook url')
        .description("Create the crons")
        .action(function (args) { return create(glueStackPlugin, args); });
}
exports.cronsAdd = cronsAdd;
function create(glueStackPlugin, args) {
    return __awaiter(this, void 0, void 0, function () {
        var fileContent, content, cronsPath, appEventFilePath, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cronsPath = './backend/crons';
                    if ('function' in args && 'webhook' in args) {
                        console.log("please give either --f function or --w webhook-url");
                        return [2];
                    }
                    if (!args.hasOwnProperty('function')) return [3, 2];
                    return [4, createContent('function', args["function"], args.schedule)];
                case 1:
                    content = _a.sent();
                    _a.label = 2;
                case 2:
                    if (!args.hasOwnProperty('webhook')) return [3, 4];
                    return [4, createContent('webhook', args.webhook, args.schedule)];
                case 3:
                    content = _a.sent();
                    _a.label = 4;
                case 4:
                    if (!(args.hasOwnProperty('schedule') && (args.hasOwnProperty('function') || args.hasOwnProperty('webhook')) && cron.validate(args.schedule))) return [3, 10];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 8, , 9]);
                    return [4, (0, file_exists_1.fileExists)("".concat(cronsPath, "/crons.json"))];
                case 6:
                    if (_a.sent()) {
                        appEventFilePath = path.join(process.cwd(), cronsPath.slice(2), 'crons');
                        data = require(appEventFilePath);
                        data.push(content);
                        fileContent = JSON.stringify(data, null, 2);
                    }
                    else {
                        fileContent = "[".concat(JSON.stringify(content, null, 2), "]");
                    }
                    return [4, (0, write_file_1.writeFile)("".concat(cronsPath, "/crons.json"), fileContent)];
                case 7:
                    _a.sent();
                    return [3, 9];
                case 8:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [3, 9];
                case 9: return [3, 11];
                case 10:
                    console.log("please provide correct schedule value here eg:\nnode glue crons:add --s `* * * * *`");
                    _a.label = 11;
                case 11: return [2];
            }
        });
    });
}
exports.create = create;
function createContent(type, value, schedule) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, {
                    schedule: schedule,
                    type: type,
                    value: value
                }];
        });
    });
}
exports.createContent = createContent;
module.exports = { cronsAdd: cronsAdd };
//# sourceMappingURL=cronsAdd.js.map