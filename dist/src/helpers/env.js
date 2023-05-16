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
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var helpers_1 = require("@gluestack/helpers");
var lodash_1 = require("lodash");
var Env = (function () {
    function Env(envContent, build, routes) {
        if (routes === void 0) { routes = []; }
        var _this = this;
        this.keys = envContent;
        routes.map(function (route) {
            var server = route.domain.split(".")[0] || "";
            if (!_this.keys["ENDPOINT_".concat(server.toUpperCase())]) {
                _this.keys["ENDPOINT_".concat(server.toUpperCase())] = "http://localhost:".concat(route.port);
            }
        });
        this.build = build;
        this.keyCharacter = "%";
        this.envs = [];
        this.filepath = (0, path_1.join)(process.cwd(), this.build === "dev" ? ".env.generated" : ".env");
    }
    Env.prototype.addEnv = function (instance, envContent, path) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var _d, _e, _f, key, e_1_1, childEnv;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 5, 6, 11]);
                        _d = true, _e = __asyncValues(Object.keys(envContent));
                        _g.label = 1;
                    case 1: return [4, _e.next()];
                    case 2:
                        if (!(_f = _g.sent(), _a = _f.done, !_a)) return [3, 4];
                        _c = _f.value;
                        _d = false;
                        try {
                            key = _c;
                            this.keys[(0, helpers_1.getCrossEnvKey)(instance, key)] = envContent[key];
                        }
                        finally {
                            _d = true;
                        }
                        _g.label = 3;
                    case 3: return [3, 1];
                    case 4: return [3, 11];
                    case 5:
                        e_1_1 = _g.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 11];
                    case 6:
                        _g.trys.push([6, , 9, 10]);
                        if (!(!_d && !_a && (_b = _e.return))) return [3, 8];
                        return [4, _b.call(_e)];
                    case 7:
                        _g.sent();
                        _g.label = 8;
                    case 8: return [3, 10];
                    case 9:
                        if (e_1) throw e_1.error;
                        return [7];
                    case 10: return [7];
                    case 11:
                        childEnv = new ChildEnv((0, helpers_1.getPrefix)(instance), instance, envContent, path, this.build);
                        this.envs.push(childEnv);
                        return [2];
                }
            });
        });
    };
    Env.prototype.generate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var key, prefix, replaceKeys, _i, replaceKeys_1, replaceKey, childEnv, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        for (key in this.keys) {
                            prefix = key.split("_")[0];
                            replaceKeys = this.getReplaceKeys(this.keys[key]);
                            for (_i = 0, replaceKeys_1 = replaceKeys; _i < replaceKeys_1.length; _i++) {
                                replaceKey = replaceKeys_1[_i];
                                this.keys[key] = this.keys[key].replaceAll("".concat(this.keyCharacter).concat(replaceKey).concat(this.keyCharacter), this.keys[replaceKey] || "");
                                childEnv = (0, lodash_1.find)(this.envs, { prefix: prefix });
                                if (childEnv) {
                                    childEnv.updateKey(key.replace(new RegExp("^" + "".concat(prefix, "_")), ""), this.keys[key]);
                                }
                            }
                        }
                        return [4, this.writeEnv()];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.log("> .env file creation failed due to following reasons -");
                        console.log(err_1);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    Env.prototype.writeEnv = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, childEnv, env;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.envs;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 5];
                        childEnv = _a[_i];
                        if (!(childEnv.filepath === this.filepath)) return [3, 2];
                        this.keys = __assign(__assign({}, this.keys), childEnv.keys);
                        return [3, 4];
                    case 2: return [4, childEnv.writeEnv()];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3, 1];
                    case 5:
                        env = (0, helpers_1.jsonToEnv)(this.keys);
                        return [4, (0, helpers_1.writeFile)(this.filepath, env)];
                    case 6:
                        _b.sent();
                        return [2];
                }
            });
        });
    };
    Env.prototype.getReplaceKeys = function (str) {
        if (!str.includes(this.keyCharacter)) {
            return [];
        }
        var specialChar = "%";
        var startIdx = str.indexOf(specialChar);
        var endIdx = str.indexOf(specialChar, startIdx + 1);
        var result = [];
        while (startIdx !== -1 && endIdx !== -1) {
            var substring = str.substring(startIdx + 1, endIdx);
            result.push(substring);
            var nextStartIdx = str.indexOf(specialChar, endIdx + 1);
            startIdx = endIdx;
            endIdx = nextStartIdx;
        }
        return result;
    };
    return Env;
}());
exports.default = Env;
var ChildEnv = (function () {
    function ChildEnv(prefix, instance, keys, path, build) {
        this.prefix = prefix;
        this.instance = instance;
        this.keys = keys;
        this.filepath = (0, path_1.join)(path, build === "dev" ? ".env.generated" : ".env");
    }
    ChildEnv.prototype.updateKey = function (key, value) {
        this.keys[key] = value;
    };
    ChildEnv.prototype.writeEnv = function () {
        return __awaiter(this, void 0, void 0, function () {
            var env;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        env = (0, helpers_1.jsonToEnv)(this.keys);
                        if (!env) return [3, 2];
                        return [4, (0, helpers_1.writeFile)(this.filepath, env)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        });
    };
    return ChildEnv;
}());
//# sourceMappingURL=env.js.map