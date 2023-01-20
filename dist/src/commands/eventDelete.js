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
exports.__esModule = true;
exports.deleteEvents = exports.eventDelete = void 0;
var fs = require('fs');
var _a = require('enquirer'), MultiSelect = _a.MultiSelect, confirm = _a.confirm;
var path = require('path');
function eventDelete(program, glueStackPlugin) {
    var command = program
        .command("events:delete")
        .option('--app', 'list all app events to delete')
        .option('--database', 'list all database events to delete')
        .description("List the events with select option to delete selected events")
        .action(function (args) { return deleteEvents(glueStackPlugin, args); });
}
exports.eventDelete = eventDelete;
function deleteEvents(glueStackPlugin, args) {
    return __awaiter(this, void 0, void 0, function () {
        var dbEventPath, appEventPath, files, files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dbEventPath = './backend/events/database';
                    appEventPath = './backend/events/app';
                    if (Object.entries(args).length === 0) {
                        console.log("please give at least one event type for eg:\nnode glue events:delete --app or --database ");
                    }
                    if (!args.hasOwnProperty('app')) return [3, 2];
                    files = fs.readdirSync(appEventPath);
                    return [4, deleteSelected(files, appEventPath)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!args.hasOwnProperty('database')) return [3, 4];
                    files = fs.readdirSync(dbEventPath);
                    return [4, deleteSelected(files, dbEventPath)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2];
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
                if (!(choices.length !== 0)) return [3, 11];
                prompted = new MultiSelect({
                    name: 'files',
                    message: 'Select the files and directories you want to delete by pressing <space>:',
                    choices: choices
                });
                return [4, prompted.run()];
            case 1:
                selectedIndexes = _a.sent();
                if (!(selectedIndexes.length !== 0)) return [3, 10];
                return [4, confirm({
                        name: 'question',
                        message: 'Are you sure you want to delete the selected files and folders?'
                    })];
            case 2:
                userConfirm = _a.sent();
                if (!userConfirm) return [3, 10];
                _i = 0, selectedIndexes_1 = selectedIndexes;
                _a.label = 3;
            case 3:
                if (!(_i < selectedIndexes_1.length)) return [3, 10];
                index = selectedIndexes_1[_i];
                filePath = path.join(eventPath, index);
                return [4, fs.promises.lstat(filePath)];
            case 4:
                stats = _a.sent();
                if (!stats.isDirectory()) return [3, 6];
                return [4, fs.promises.rm(filePath, { recursive: true })];
            case 5:
                _a.sent();
                return [3, 8];
            case 6: return [4, fs.promises.unlink(filePath)];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                console.log("Deleted ".concat(index, " event"));
                _a.label = 9;
            case 9:
                _i++;
                return [3, 3];
            case 10: return [3, 12];
            case 11:
                console.log("no events found to be delete");
                _a.label = 12;
            case 12: return [2];
        }
    });
}); };
module.exports = { eventDelete: eventDelete };
//# sourceMappingURL=eventDelete.js.map