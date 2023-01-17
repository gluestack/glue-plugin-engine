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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var get = require('lodash').get;
var path_1 = require("path");
var cron = __importStar(require("node-cron"));
var file_exists_1 = require("../helpers/file-exists");
var GluestackConfig_1 = require("./GluestackConfig");
var GluestackCron = (function () {
    function GluestackCron() {
        this.filePath = 'crons/crons.json';
        this.collection = [];
    }
    GluestackCron.prototype.collect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var backendInstance, filePath, collection, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        backendInstance = (0, GluestackConfig_1.getConfig)('backendInstancePath');
                        filePath = (0, path_1.join)(process.cwd(), backendInstance, this.filePath);
                        return [4, (0, file_exists_1.fileExists)(filePath)];
                    case 1:
                        if (!(_a.sent())) {
                            return [2];
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        collection = require(filePath);
                        return [4, this.validate(collection)];
                    case 3:
                        _a.sent();
                        return [3, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.log('> Something went wrong during crons.json file reading. Please check your "crons/crons.json" config file again!');
                        return [3, 5];
                    case 5: return [2];
                }
            });
        });
    };
    GluestackCron.prototype.validate = function (collection) {
        var _a, collection_1, collection_1_1;
        var _b, e_1, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var object, schedule, type, value, e_1_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 5, 6, 11]);
                        _a = true, collection_1 = __asyncValues(collection);
                        _e.label = 1;
                    case 1: return [4, collection_1.next()];
                    case 2:
                        if (!(collection_1_1 = _e.sent(), _b = collection_1_1.done, !_b)) return [3, 4];
                        _d = collection_1_1.value;
                        _a = false;
                        try {
                            object = _d;
                            schedule = get(object, 'schedule', '');
                            type = get(object, 'type', '');
                            value = get(object, 'value', '');
                            if (!schedule || !type || !value
                                || !cron.validate(schedule)) {
                                console.log('> Found invalid schedule. Skipping...');
                                console.log(__assign({}, object));
                                return [3, 3];
                            }
                            else {
                                this.collection.push(object);
                            }
                        }
                        finally {
                            _a = true;
                        }
                        _e.label = 3;
                    case 3: return [3, 1];
                    case 4: return [3, 11];
                    case 5:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 11];
                    case 6:
                        _e.trys.push([6, , 9, 10]);
                        if (!(!_a && !_b && (_c = collection_1.return))) return [3, 8];
                        return [4, _c.call(collection_1)];
                    case 7:
                        _e.sent();
                        _e.label = 8;
                    case 8: return [3, 10];
                    case 9:
                        if (e_1) throw e_1.error;
                        return [7];
                    case 10: return [7];
                    case 11: return [2];
                }
            });
        });
    };
    GluestackCron.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.collect()];
                    case 1:
                        _a.sent();
                        return [4, (0, GluestackConfig_1.prepareConfigJSON)({ crons: this.collection })];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return GluestackCron;
}());
exports.default = GluestackCron;
//# sourceMappingURL=GluestackCron.js.map