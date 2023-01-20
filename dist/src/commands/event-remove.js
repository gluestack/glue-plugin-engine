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
exports.deleteEvents = exports.eventRemove = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var _a = require("enquirer"), MultiSelect = _a.MultiSelect, confirm = _a.confirm;
function eventRemove(program, glueStackPlugin) {
    program
        .command("events:remove")
        .option("--app", "list all app events to delete")
        .option("--database", "list all database events to delete")
        .description("List the events with select option to delete selected events")
        .action(function (args) { return deleteEvents(glueStackPlugin, args); });
}
exports.eventRemove = eventRemove;
function deleteEvents(_glueStackPlugin, args) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var eventTypes, selectedEventTypes, _d, selectedEventTypes_1, selectedEventTypes_1_1, eventType, files, e_1_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    eventTypes = {
                        app: "./backend/events/app",
                        database: "./backend/events/database",
                    };
                    selectedEventTypes = Object.keys(args).filter(function (key) {
                        return eventTypes.hasOwnProperty(key);
                    });
                    if (selectedEventTypes.length === 0) {
                        console.log("please give at least one event type for eg:\nnode glue events:delete --app or --database ");
                        return [2];
                    }
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 9, 10, 15]);
                    _d = true, selectedEventTypes_1 = __asyncValues(selectedEventTypes);
                    _e.label = 2;
                case 2: return [4, selectedEventTypes_1.next()];
                case 3:
                    if (!(selectedEventTypes_1_1 = _e.sent(), _a = selectedEventTypes_1_1.done, !_a)) return [3, 8];
                    _c = selectedEventTypes_1_1.value;
                    _d = false;
                    _e.label = 4;
                case 4:
                    _e.trys.push([4, , 6, 7]);
                    eventType = _c;
                    files = fs_1.default.readdirSync(eventTypes[eventType]);
                    return [4, deleteSelected(files, eventTypes[eventType])];
                case 5:
                    _e.sent();
                    return [3, 7];
                case 6:
                    _d = true;
                    return [7];
                case 7: return [3, 2];
                case 8: return [3, 15];
                case 9:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3, 15];
                case 10:
                    _e.trys.push([10, , 13, 14]);
                    if (!(!_d && !_a && (_b = selectedEventTypes_1.return))) return [3, 12];
                    return [4, _b.call(selectedEventTypes_1)];
                case 11:
                    _e.sent();
                    _e.label = 12;
                case 12: return [3, 14];
                case 13:
                    if (e_1) throw e_1.error;
                    return [7];
                case 14: return [7];
                case 15: return [2];
            }
        });
    });
}
exports.deleteEvents = deleteEvents;
var deleteSelected = function (files, eventPath) { return __awaiter(void 0, void 0, void 0, function () {
    var choices, prompted, selectedIndexes, userConfirm, _i, selectedIndexes_1, index, filePath, stats;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                choices = files.map(function (file, index) {
                    return { name: file, value: index };
                });
                if (choices.length === 0) {
                    console.log("No events found to delete.");
                    process.exit(0);
                }
                prompted = new MultiSelect({
                    name: "files",
                    message: "Select the files and directories you want to delete by pressing <space>:",
                    choices: choices,
                });
                return [4, prompted.run()];
            case 1:
                selectedIndexes = _a.sent();
                if (selectedIndexes.length === 0) {
                    process.exit(0);
                }
                return [4, confirm({
                        name: "question",
                        message: "Are you sure you want to delete the selected files and folders?",
                    })];
            case 2:
                userConfirm = _a.sent();
                if (!userConfirm) {
                    process.exit(0);
                }
                _i = 0, selectedIndexes_1 = selectedIndexes;
                _a.label = 3;
            case 3:
                if (!(_i < selectedIndexes_1.length)) return [3, 10];
                index = selectedIndexes_1[_i];
                filePath = path_1.default.join(eventPath, index);
                return [4, fs_1.default.promises.lstat(filePath)];
            case 4:
                stats = _a.sent();
                if (!stats.isDirectory()) return [3, 6];
                return [4, fs_1.default.promises.rm(filePath, { recursive: true })];
            case 5:
                _a.sent();
                return [3, 8];
            case 6: return [4, fs_1.default.promises.unlink(filePath)];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                console.log("Deleted ".concat(index, " event"));
                _a.label = 9;
            case 9:
                _i++;
                return [3, 3];
            case 10: return [2];
        }
    });
}); };
module.exports = { eventRemove: eventRemove };
//# sourceMappingURL=event-remove.js.map