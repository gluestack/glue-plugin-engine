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
var axios = require("axios")["default"];
var path_1 = require("path");
var dotenv = __importStar(require("dotenv"));
var node_fs_1 = require("node:fs");
var generate_action_custom_types_1 = require("../helpers/generate-action-custom-types");
var HasuraMetadata = (function () {
    function HasuraMetadata(backendInstancePath, pluginName) {
        this.pluginName = pluginName;
        this.backendInstancePath = backendInstancePath;
        this.hasuraEnvs = this.captureEnvVars();
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
    HasuraMetadata.prototype.createActionCustomTypes = function (action) {
        return __awaiter(this, void 0, void 0, function () {
            var setting, regex, match, kind, schema, payloads;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setting = (0, node_fs_1.readFileSync)(action.setting_path, 'utf8');
                        regex = /execution="(.*)"/g;
                        match = regex.exec(setting);
                        kind = match[1] === 'sync' ? 'synchronous' : 'asynchronous';
                        schema = (0, node_fs_1.readFileSync)(action.grapqhl_path, 'utf8');
                        payloads = {};
                        try {
                            payloads = (0, generate_action_custom_types_1.generateActionCustomTypes)(schema, kind);
                        }
                        catch (error) {
                            console.log("> Action Instance ".concat(action.name, " has invalid graphql schema. Skipping..."));
                            return [2, Promise.resolve('failed')];
                        }
                        console.log("\n> Creating action ".concat(action.name, "..."));
                        console.log("> Creating custom types for action ".concat(action.name, "..."));
                        return [4, this.makeRequest(payloads.customTypesData)];
                    case 1:
                        _a.sent();
                        return [4, this.makeRequest(payloads.actionData)];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    HasuraMetadata.prototype.captureEnvVars = function () {
        var envPath = (0, path_1.join)(process.cwd(), this.backendInstancePath, 'functions', this.pluginName, '.env');
        return dotenv.config({ path: envPath }).parsed;
    };
    HasuraMetadata.prototype.makeRequest = function (data, terminateOnError) {
        if (terminateOnError === void 0) { terminateOnError = false; }
        return __awaiter(this, void 0, void 0, function () {
            var hasuraEnvs, options, error_1;
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
                        error_1 = _a.sent();
                        if (error_1.response.data.error) {
                            console.log('>', error_1.response.data.error);
                        }
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    return HasuraMetadata;
}());
exports["default"] = HasuraMetadata;
//# sourceMappingURL=HasuraMetadata.js.map