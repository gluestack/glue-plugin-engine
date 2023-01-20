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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios = require("axios").default;
var path_1 = require("path");
var dotenv = __importStar(require("dotenv"));
var node_fs_1 = require("node:fs");
var GluestackConfig_1 = require("./GluestackConfig");
var generate_events_1 = require("../helpers/generate-events");
var generate_action_custom_types_1 = require("../helpers/generate-action-custom-types");
var generate_action_custom_types_2 = require("../helpers/generate-action-custom-types");
var HasuraMetadata = (function () {
    function HasuraMetadata(pluginName) {
        this.pluginName = pluginName;
        this.hasuraEnvs = this.captureEnvVars();
        (0, GluestackConfig_1.setConfig)('hasuraEnvs', this.hasuraEnvs);
    }
    HasuraMetadata.prototype.dropAction = function (actionName) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            "type": "drop_action",
                            "args": {
                                "name": actionName,
                                "clear_data": true
                            }
                        };
                        return [4, this.makeRequest(data)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    HasuraMetadata.prototype.createAction = function (action) {
        return __awaiter(this, void 0, void 0, function () {
            var setting, regex, match, kind, schema, actionData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setting = (0, node_fs_1.readFileSync)(action.setting_path, 'utf8');
                        regex = /execution="(.*)"/g;
                        match = regex.exec(setting);
                        kind = match[1] === 'sync' ? 'synchronous' : 'asynchronous';
                        schema = (0, node_fs_1.readFileSync)(action.grapqhl_path, 'utf8');
                        actionData = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, (0, generate_action_custom_types_1.generate)(schema, kind, 'action', action)];
                    case 2:
                        actionData = _a.sent();
                        return [3, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.log("> Action Instance ".concat(action.name, " has invalid graphql schema. Skipping..."));
                        return [2, Promise.resolve('failed')];
                    case 4: return [4, this.makeRequest(actionData, true)];
                    case 5:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    HasuraMetadata.prototype.createActionPermission = function (action) {
        return __awaiter(this, void 0, void 0, function () {
            var setting, regex, match, roles, schema, actionData, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setting = (0, node_fs_1.readFileSync)(action.setting_path, 'utf8');
                        regex = /roles="(.*)"/g;
                        match = regex.exec(setting);
                        if (!(match === null || match === void 0 ? void 0 : match[1])) return [3, 6];
                        roles = match[1].split(",");
                        schema = (0, node_fs_1.readFileSync)(action.grapqhl_path, 'utf8');
                        actionData = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, (0, generate_action_custom_types_2.generateActionPermission)(schema, roles)];
                    case 2:
                        actionData = _a.sent();
                        return [3, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.log("> Action Instance ".concat(action.name, " has invalid graphql schema. Skipping..."));
                        return [2, Promise.resolve('failed')];
                    case 4: return [4, this.makeRequest(actionData, true)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2];
                }
            });
        });
    };
    HasuraMetadata.prototype.createCustomTypes = function (actions) {
        var _a, actions_1, actions_1_1;
        var _b, e_1, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var customTypes, action, setting, regex, match, kind, schema, _tmp, error_3, e_1_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        customTypes = {
                            type: 'set_custom_types',
                            args: {
                                scalars: [],
                                enums: [],
                                objects: [],
                                input_objects: []
                            }
                        };
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 12, 13, 18]);
                        _a = true, actions_1 = __asyncValues(actions);
                        _e.label = 2;
                    case 2: return [4, actions_1.next()];
                    case 3:
                        if (!(actions_1_1 = _e.sent(), _b = actions_1_1.done, !_b)) return [3, 11];
                        _d = actions_1_1.value;
                        _a = false;
                        _e.label = 4;
                    case 4:
                        _e.trys.push([4, , 9, 10]);
                        action = _d;
                        setting = (0, node_fs_1.readFileSync)(action.setting_path, 'utf8');
                        regex = /execution="(.*)"/g;
                        match = regex.exec(setting);
                        kind = match[1] === 'sync' ? 'synchronous' : 'asynchronous';
                        schema = (0, node_fs_1.readFileSync)(action.grapqhl_path, 'utf8');
                        _e.label = 5;
                    case 5:
                        _e.trys.push([5, 7, , 8]);
                        return [4, (0, generate_action_custom_types_1.generate)(schema, kind, 'custom_types')];
                    case 6:
                        _tmp = _e.sent();
                        customTypes.type = _tmp.type;
                        customTypes.args.scalars = __spreadArray(__spreadArray([], customTypes.args.scalars, true), _tmp.args.scalars, true);
                        customTypes.args.enums = __spreadArray(__spreadArray([], customTypes.args.enums, true), _tmp.args.enums, true);
                        customTypes.args.objects = __spreadArray(__spreadArray([], customTypes.args.objects, true), _tmp.args.objects, true);
                        customTypes.args.input_objects = __spreadArray(__spreadArray([], customTypes.args.input_objects, true), _tmp.args.input_objects, true);
                        return [3, 8];
                    case 7:
                        error_3 = _e.sent();
                        console.log("> Action Instance ".concat(action.name, " has invalid graphql schema. Skipping..."));
                        return [3, 10];
                    case 8: return [3, 10];
                    case 9:
                        _a = true;
                        return [7];
                    case 10: return [3, 2];
                    case 11: return [3, 18];
                    case 12:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 18];
                    case 13:
                        _e.trys.push([13, , 16, 17]);
                        if (!(!_a && !_b && (_c = actions_1.return))) return [3, 15];
                        return [4, _c.call(actions_1)];
                    case 14:
                        _e.sent();
                        _e.label = 15;
                    case 15: return [3, 17];
                    case 16:
                        if (e_1) throw e_1.error;
                        return [7];
                    case 17: return [7];
                    case 18: return [4, this.makeRequest(customTypes, true)];
                    case 19:
                        _e.sent();
                        return [2];
                }
            });
        });
    };
    HasuraMetadata.prototype.createEvent = function (tableName, events) {
        return __awaiter(this, void 0, void 0, function () {
            var hasuraEnvs, HASURA_GRAPHQL_DB_NAME, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hasuraEnvs = this.hasuraEnvs;
                        HASURA_GRAPHQL_DB_NAME = hasuraEnvs.HASURA_GRAPHQL_DB_NAME;
                        return [4, (0, generate_events_1.generate)(tableName, HASURA_GRAPHQL_DB_NAME, events)];
                    case 1:
                        payload = _a.sent();
                        return [4, this.makeRequest(payload, true)];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    HasuraMetadata.prototype.dropEvent = function (tableName, events) {
        return __awaiter(this, void 0, void 0, function () {
            var hasuraEnvs, HASURA_GRAPHQL_DB_NAME, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hasuraEnvs = this.hasuraEnvs;
                        HASURA_GRAPHQL_DB_NAME = hasuraEnvs.HASURA_GRAPHQL_DB_NAME;
                        payload = {
                            type: 'pg_delete_event_trigger',
                            args: {
                                name: "".concat(tableName, "_trigger"),
                                source: HASURA_GRAPHQL_DB_NAME
                            }
                        };
                        return [4, this.makeRequest(payload)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    HasuraMetadata.prototype.tracks = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.makeRequest(data)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    HasuraMetadata.prototype.makeRequest = function (data, showError) {
        if (showError === void 0) { showError = false; }
        return __awaiter(this, void 0, void 0, function () {
            var hasuraEnvs, options, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hasuraEnvs = this.hasuraEnvs;
                        options = {
                            method: 'POST',
                            url: "".concat(hasuraEnvs.HASURA_GRAPHQL_URL, "/v1/metadata"),
                            headers: {
                                'Content-Type': 'application/json',
                                'x-hasura-role': 'admin',
                                'x-hasura-admin-secret': hasuraEnvs.HASURA_GRAPHQL_ADMIN_SECRET
                            },
                            data: data
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, axios.request(options)];
                    case 2:
                        _a.sent();
                        return [3, 4];
                    case 3:
                        error_4 = _a.sent();
                        if (showError && error_4.response && error_4.response.data.error) {
                            console.log('> Error:', error_4.response.data.error);
                        }
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    HasuraMetadata.prototype.captureEnvVars = function () {
        var envPath = (0, path_1.join)(process.cwd(), (0, GluestackConfig_1.getConfig)('backendInstancePath'), 'functions', this.pluginName, '.env');
        return dotenv.config({ path: envPath }).parsed;
    };
    return HasuraMetadata;
}());
exports.default = HasuraMetadata;
//# sourceMappingURL=HasuraMetadata.js.map