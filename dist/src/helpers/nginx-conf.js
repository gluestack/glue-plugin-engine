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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var path_1 = require("path");
var fs_1 = require("fs");
var file_exists_1 = require("./file-exists");
var nginx_literals_1 = require("./nginx-literals");
var NginxConf = (function () {
    function NginxConf() {
        this.upstreams = [];
    }
    NginxConf.prototype.generate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conf, filepath, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.toConf()];
                    case 1:
                        conf = _a.sent();
                        filepath = (0, path_1.join)(process.cwd(), 'nginx.conf');
                        (0, fs_1.writeFileSync)(filepath, conf);
                        console.log('> NGINX file created successfully -', (0, path_1.relative)('.', filepath));
                        return [3, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.log('> NGINX file creation failed due to following reasons -');
                        console.log(err_1);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    NginxConf.prototype.addRouter = function (port, string) {
        return __awaiter(this, void 0, void 0, function () {
            var upstreams, exist;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        upstreams = this.upstreams;
                        return [4, (0, file_exists_1.fileExists)(string)];
                    case 1:
                        exist = _a.sent();
                        if (!exist)
                            return [2, Promise.resolve(false)];
                        upstreams.push({ locations: __spreadArray([], require(string)(), true), port: port });
                        return [2, Promise.resolve(true)];
                }
            });
        });
    };
    NginxConf.prototype.toConf = function () {
        var _a, e_1, _b, _c, _d, e_2, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            var locations, domain, upstreams, _g, upstreams_1, upstreams_1_1, upstream, _h, _j, _k, location_1, e_2_1, e_1_1;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        locations = [];
                        domain = '';
                        upstreams = this.upstreams;
                        _l.label = 1;
                    case 1:
                        _l.trys.push([1, 20, 21, 26]);
                        _g = true, upstreams_1 = __asyncValues(upstreams);
                        _l.label = 2;
                    case 2: return [4, upstreams_1.next()];
                    case 3:
                        if (!(upstreams_1_1 = _l.sent(), _a = upstreams_1_1.done, !_a)) return [3, 19];
                        _c = upstreams_1_1.value;
                        _g = false;
                        _l.label = 4;
                    case 4:
                        _l.trys.push([4, , 17, 18]);
                        upstream = _c;
                        _l.label = 5;
                    case 5:
                        _l.trys.push([5, 10, 11, 16]);
                        _h = true, _j = (e_2 = void 0, __asyncValues(upstream.locations));
                        _l.label = 6;
                    case 6: return [4, _j.next()];
                    case 7:
                        if (!(_k = _l.sent(), _d = _k.done, !_d)) return [3, 9];
                        _f = _k.value;
                        _h = false;
                        try {
                            location_1 = _f;
                            if (location_1.hasOwnProperty('server_name')) {
                                domain = '_';
                            }
                            if (location_1.hasOwnProperty('path')) {
                                locations.push((0, nginx_literals_1.setLocation)(location_1.path, "host.docker.internal:".concat(upstream.port), location_1.proxy.path, location_1.host, location_1.size_in_mb || 50));
                            }
                        }
                        finally {
                            _h = true;
                        }
                        _l.label = 8;
                    case 8: return [3, 6];
                    case 9: return [3, 16];
                    case 10:
                        e_2_1 = _l.sent();
                        e_2 = { error: e_2_1 };
                        return [3, 16];
                    case 11:
                        _l.trys.push([11, , 14, 15]);
                        if (!(!_h && !_d && (_e = _j["return"]))) return [3, 13];
                        return [4, _e.call(_j)];
                    case 12:
                        _l.sent();
                        _l.label = 13;
                    case 13: return [3, 15];
                    case 14:
                        if (e_2) throw e_2.error;
                        return [7];
                    case 15: return [7];
                    case 16: return [3, 18];
                    case 17:
                        _g = true;
                        return [7];
                    case 18: return [3, 2];
                    case 19: return [3, 26];
                    case 20:
                        e_1_1 = _l.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 26];
                    case 21:
                        _l.trys.push([21, , 24, 25]);
                        if (!(!_g && !_a && (_b = upstreams_1["return"]))) return [3, 23];
                        return [4, _b.call(upstreams_1)];
                    case 22:
                        _l.sent();
                        _l.label = 23;
                    case 23: return [3, 25];
                    case 24:
                        if (e_1) throw e_1.error;
                        return [7];
                    case 25: return [7];
                    case 26: return [2, Promise.resolve(nginx_literals_1.startsWith + (0, nginx_literals_1.setServer)(domain, locations) + nginx_literals_1.endsWith)];
                }
            });
        });
    };
    return NginxConf;
}());
exports["default"] = NginxConf;
//# sourceMappingURL=nginx-conf.js.map