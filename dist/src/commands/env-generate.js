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
exports.__esModule = true;
exports.runner = exports.envGenerate = void 0;
var path_1 = require("path");
var env_1 = __importDefault(require("../helpers/env"));
var helpers_1 = require("@gluestack/helpers");
var envGenerate = function (program, glueStackPlugin) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        program
            .command("env:generate")
            .option("--build <build>", "Generates env based on the platform . Options: 'dev' or 'prod'", "dev")
            .description("Generates .env.generated for all the instances")
            .action(function (options) { return (0, exports.runner)(glueStackPlugin, options); });
        return [2];
    });
}); };
exports.envGenerate = envGenerate;
var runner = function (glueStackPlugin, options) { return __awaiter(void 0, void 0, void 0, function () {
    var build, instances, app, plugins, _a, plugins_1, plugins_1_1, plugin_1, _b, _c, _d, instance_1, name_1, details, _e, e_1_1, e_2_1, routes, plugin, instance, name, routerFilepath, env, _f, instances_1, instances_1_1, instance_2, e_3_1;
    var _g, e_2, _h, _j, _k, e_1, _l, _m, _o, e_3, _p, _q;
    return __generator(this, function (_r) {
        switch (_r.label) {
            case 0:
                build = options.build;
                instances = [];
                app = glueStackPlugin.app;
                plugins = app.plugins;
                _r.label = 1;
            case 1:
                _r.trys.push([1, 24, 25, 30]);
                _a = true, plugins_1 = __asyncValues(plugins);
                _r.label = 2;
            case 2: return [4, plugins_1.next()];
            case 3:
                if (!(plugins_1_1 = _r.sent(), _g = plugins_1_1.done, !_g)) return [3, 23];
                _j = plugins_1_1.value;
                _a = false;
                _r.label = 4;
            case 4:
                _r.trys.push([4, , 21, 22]);
                plugin_1 = _j;
                _r.label = 5;
            case 5:
                _r.trys.push([5, 14, 15, 20]);
                _b = true, _c = (e_1 = void 0, __asyncValues(plugin_1.getInstances()));
                _r.label = 6;
            case 6: return [4, _c.next()];
            case 7:
                if (!(_d = _r.sent(), _k = _d.done, !_k)) return [3, 13];
                _m = _d.value;
                _b = false;
                _r.label = 8;
            case 8:
                _r.trys.push([8, , 11, 12]);
                instance_1 = _m;
                name_1 = instance_1 === null || instance_1 === void 0 ? void 0 : instance_1.callerPlugin.getName();
                if (!(instance_1 && name_1)) return [3, 10];
                details = {
                    name: name_1,
                    instance: instance_1.getName()
                };
                details.path = (0, path_1.join)(process.cwd(), instance_1.getInstallationPath());
                _e = details;
                return [4, (0, helpers_1.envToJson)((0, path_1.join)(details.path, ".env"))];
            case 9:
                _e.env = _r.sent();
                instances.push(details);
                _r.label = 10;
            case 10: return [3, 12];
            case 11:
                _b = true;
                return [7];
            case 12: return [3, 6];
            case 13: return [3, 20];
            case 14:
                e_1_1 = _r.sent();
                e_1 = { error: e_1_1 };
                return [3, 20];
            case 15:
                _r.trys.push([15, , 18, 19]);
                if (!(!_b && !_k && (_l = _c["return"]))) return [3, 17];
                return [4, _l.call(_c)];
            case 16:
                _r.sent();
                _r.label = 17;
            case 17: return [3, 19];
            case 18:
                if (e_1) throw e_1.error;
                return [7];
            case 19: return [7];
            case 20: return [3, 22];
            case 21:
                _a = true;
                return [7];
            case 22: return [3, 2];
            case 23: return [3, 30];
            case 24:
                e_2_1 = _r.sent();
                e_2 = { error: e_2_1 };
                return [3, 30];
            case 25:
                _r.trys.push([25, , 28, 29]);
                if (!(!_a && !_g && (_h = plugins_1["return"]))) return [3, 27];
                return [4, _h.call(plugins_1)];
            case 26:
                _r.sent();
                _r.label = 27;
            case 27: return [3, 29];
            case 28:
                if (e_2) throw e_2.error;
                return [7];
            case 29: return [7];
            case 30:
                routes = [];
                plugin = glueStackPlugin.app.getPluginByName('@gluestack/glue-plugin-router-nginx');
                instance = plugin.getInstances()[0];
                name = instance.getName();
                routerFilepath = (0, path_1.join)(process.cwd(), 'meta', 'router', name, 'routes.json');
                return [4, (0, helpers_1.fileExists)(routerFilepath)];
            case 31:
                if (_r.sent()) {
                    routes = require(routerFilepath);
                }
                env = new env_1["default"](build, routes);
                _r.label = 32;
            case 32:
                _r.trys.push([32, 40, 41, 46]);
                _f = true, instances_1 = __asyncValues(instances);
                _r.label = 33;
            case 33: return [4, instances_1.next()];
            case 34:
                if (!(instances_1_1 = _r.sent(), _o = instances_1_1.done, !_o)) return [3, 39];
                _q = instances_1_1.value;
                _f = false;
                _r.label = 35;
            case 35:
                _r.trys.push([35, , 37, 38]);
                instance_2 = _q;
                return [4, env.addEnv(instance_2.instance, instance_2.env, instance_2.path)];
            case 36:
                _r.sent();
                return [3, 38];
            case 37:
                _f = true;
                return [7];
            case 38: return [3, 33];
            case 39: return [3, 46];
            case 40:
                e_3_1 = _r.sent();
                e_3 = { error: e_3_1 };
                return [3, 46];
            case 41:
                _r.trys.push([41, , 44, 45]);
                if (!(!_f && !_o && (_p = instances_1["return"]))) return [3, 43];
                return [4, _p.call(instances_1)];
            case 42:
                _r.sent();
                _r.label = 43;
            case 43: return [3, 45];
            case 44:
                if (e_3) throw e_3.error;
                return [7];
            case 45: return [7];
            case 46: return [4, env.generate()];
            case 47:
                _r.sent();
                return [2];
        }
    });
}); };
exports.runner = runner;
//# sourceMappingURL=env-generate.js.map