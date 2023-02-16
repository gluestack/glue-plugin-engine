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
exports.runner = exports.metaPlugins = exports.routeGenerate = void 0;
var path_1 = require("path");
var nginx_conf_1 = __importDefault(require("../helpers/nginx-conf"));
var helpers_1 = require("@gluestack/helpers");
var constants_1 = require("../constants");
var create_tree_1 = require("../helpers/create-tree");
var routeGenerate = function (program, glueStackPlugin) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        program
            .command("route:generate")
            .option("--build <build>", "Generates build based on the platform . Options: 'dev' or 'prod'", "dev")
            .description("Generates router file for all the container instances")
            .action(function (options) { return (0, exports.runner)(glueStackPlugin, options); });
        return [2];
    });
}); };
exports.routeGenerate = routeGenerate;
var metaPlugins = function () { return __awaiter(void 0, void 0, void 0, function () {
    var metaPluginsPath, metaInstanceContent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                metaPluginsPath = (0, path_1.join)(process.cwd(), 'meta', 'plugins.json');
                return [4, (0, helpers_1.fileExists)(metaPluginsPath)];
            case 1:
                if (!(_a.sent())) {
                    return [2, []];
                }
                metaInstanceContent = require(metaPluginsPath);
                return [2, Object.keys(metaInstanceContent)];
        }
    });
}); };
exports.metaPlugins = metaPlugins;
var runner = function (glueStackPlugin, options) { return __awaiter(void 0, void 0, void 0, function () {
    var build, tree, statelessPlugins, app, meta, instancesAndTree, plugins, _i, _a, pluginName, _b, _c, instanceName, instance, packageJSON, peerDependencies, _d, _e, dependency, dataTree, packages, instances, _f, instances_1, instances_1_1, instance, type, name, details, _g, e_1_1;
    var _h, e_1, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                build = options.build;
                tree = {};
                statelessPlugins = [];
                app = glueStackPlugin.app;
                return [4, (0, exports.metaPlugins)()];
            case 1:
                meta = _l.sent();
                instancesAndTree = app.getContainerTypePluginInstances(false, true);
                plugins = instancesAndTree.tree;
                _i = 0, _a = Object.keys(plugins);
                _l.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3, 7];
                pluginName = _a[_i];
                tree[pluginName] = [];
                _b = 0, _c = Object.keys(plugins[pluginName]);
                _l.label = 3;
            case 3:
                if (!(_b < _c.length)) return [3, 6];
                instanceName = _c[_b];
                instance = plugins[pluginName][instanceName];
                packageJSON = (0, path_1.join)(instance.callerPlugin.getTemplateFolderPath(), '..', 'package.json');
                return [4, (0, helpers_1.fileExists)(packageJSON)];
            case 4:
                if (!(_l.sent()))
                    return [3, 5];
                try {
                    peerDependencies = require(packageJSON).peerDependencies;
                    for (_d = 0, _e = Object.keys(peerDependencies); _d < _e.length; _d++) {
                        dependency = _e[_d];
                        if (!meta.includes(dependency)) {
                            continue;
                        }
                        else {
                            tree[pluginName].push(dependency);
                        }
                    }
                }
                catch (err) {
                    console.log('>> Error:', err);
                    return [3, 5];
                }
                _l.label = 5;
            case 5:
                _b++;
                return [3, 3];
            case 6:
                _i++;
                return [3, 2];
            case 7: return [4, (0, create_tree_1.createTree)(tree, 1)];
            case 8:
                dataTree = _l.sent();
                if (dataTree.length <= 0) {
                    console.log('> No package installed, please install at least one stateless or stateful package!');
                    process.exit(0);
                }
                packages = dataTree.map(function (node) { return node.name; });
                instances = instancesAndTree.instances;
                _l.label = 9;
            case 9:
                _l.trys.push([9, 18, 19, 24]);
                _f = true, instances_1 = __asyncValues(instances);
                _l.label = 10;
            case 10: return [4, instances_1.next()];
            case 11:
                if (!(instances_1_1 = _l.sent(), _h = instances_1_1.done, !_h)) return [3, 17];
                _k = instances_1_1.value;
                _f = false;
                _l.label = 12;
            case 12:
                _l.trys.push([12, , 15, 16]);
                instance = _k;
                type = instance === null || instance === void 0 ? void 0 : instance.callerPlugin.getType();
                name = instance === null || instance === void 0 ? void 0 : instance.callerPlugin.getName();
                if (!(instance && type && name &&
                    (instance === null || instance === void 0 ? void 0 : instance.containerController) &&
                    type === 'stateless' && packages.includes(name))) return [3, 14];
                details = {
                    name: name,
                    type: type,
                    instance: instance.getName(),
                    is_backend: false
                };
                if (name === '@gluestack/glue-plugin-backend-engine') {
                    details.path = (0, path_1.join)(process.cwd(), instance.getInstallationPath(), '..');
                    details.is_backend = true;
                }
                else {
                    details.path = (0, path_1.join)(process.cwd(), instance.getInstallationPath());
                }
                details.status = instance.getContainerController().getStatus();
                _g = details;
                return [4, instance.getContainerController().getPortNumber()];
            case 13:
                _g.port = _l.sent();
                statelessPlugins.push(details);
                _l.label = 14;
            case 14: return [3, 16];
            case 15:
                _f = true;
                return [7];
            case 16: return [3, 10];
            case 17: return [3, 24];
            case 18:
                e_1_1 = _l.sent();
                e_1 = { error: e_1_1 };
                return [3, 24];
            case 19:
                _l.trys.push([19, , 22, 23]);
                if (!(!_f && !_h && (_j = instances_1["return"]))) return [3, 21];
                return [4, _j.call(instances_1)];
            case 20:
                _l.sent();
                _l.label = 21;
            case 21: return [3, 23];
            case 22:
                if (e_1) throw e_1.error;
                return [7];
            case 23: return [7];
            case 24:
                if (!(build === 'prod')) return [3, 26];
                return [4, generateProdRouter(statelessPlugins)];
            case 25:
                _l.sent();
                return [3, 28];
            case 26: return [4, generateDevRouter(statelessPlugins)];
            case 27:
                _l.sent();
                _l.label = 28;
            case 28:
                console.log(JSON.stringify((0, constants_1.getDomainMappings)()));
                return [2];
        }
    });
}); };
exports.runner = runner;
var generateProdRouter = function (statelessPlugins) { var _a, statelessPlugins_1, statelessPlugins_1_1; return __awaiter(void 0, void 0, void 0, function () {
    var nginxConf, plugin, e_2_1;
    var _b, e_2, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                nginxConf = new nginx_conf_1["default"]();
                _e.label = 1;
            case 1:
                _e.trys.push([1, 9, 10, 15]);
                _a = true, statelessPlugins_1 = __asyncValues(statelessPlugins);
                _e.label = 2;
            case 2: return [4, statelessPlugins_1.next()];
            case 3:
                if (!(statelessPlugins_1_1 = _e.sent(), _b = statelessPlugins_1_1.done, !_b)) return [3, 8];
                _d = statelessPlugins_1_1.value;
                _a = false;
                _e.label = 4;
            case 4:
                _e.trys.push([4, , 6, 7]);
                plugin = _d;
                return [4, nginxConf.addRouter(plugin.name, plugin.instance, plugin.port, (0, path_1.join)(plugin.path, 'router.js'), plugin.is_backend)];
            case 5:
                _e.sent();
                return [3, 7];
            case 6:
                _a = true;
                return [7];
            case 7: return [3, 2];
            case 8: return [3, 15];
            case 9:
                e_2_1 = _e.sent();
                e_2 = { error: e_2_1 };
                return [3, 15];
            case 10:
                _e.trys.push([10, , 13, 14]);
                if (!(!_a && !_b && (_c = statelessPlugins_1["return"]))) return [3, 12];
                return [4, _c.call(statelessPlugins_1)];
            case 11:
                _e.sent();
                _e.label = 12;
            case 12: return [3, 14];
            case 13:
                if (e_2) throw e_2.error;
                return [7];
            case 14: return [7];
            case 15: return [4, nginxConf.generateProd()];
            case 16:
                _e.sent();
                return [2];
        }
    });
}); };
var generateDevRouter = function (statelessPlugins) { var _a, statelessPlugins_2, statelessPlugins_2_1; return __awaiter(void 0, void 0, void 0, function () {
    var nginxConf, plugin, e_3_1;
    var _b, e_3, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                nginxConf = new nginx_conf_1["default"]();
                _e.label = 1;
            case 1:
                _e.trys.push([1, 9, 10, 15]);
                _a = true, statelessPlugins_2 = __asyncValues(statelessPlugins);
                _e.label = 2;
            case 2: return [4, statelessPlugins_2.next()];
            case 3:
                if (!(statelessPlugins_2_1 = _e.sent(), _b = statelessPlugins_2_1.done, !_b)) return [3, 8];
                _d = statelessPlugins_2_1.value;
                _a = false;
                _e.label = 4;
            case 4:
                _e.trys.push([4, , 6, 7]);
                plugin = _d;
                return [4, nginxConf.addRouter(plugin.name, plugin.instance, plugin.port, (0, path_1.join)(plugin.path, 'router.js'), false)];
            case 5:
                _e.sent();
                return [3, 7];
            case 6:
                _a = true;
                return [7];
            case 7: return [3, 2];
            case 8: return [3, 15];
            case 9:
                e_3_1 = _e.sent();
                e_3 = { error: e_3_1 };
                return [3, 15];
            case 10:
                _e.trys.push([10, , 13, 14]);
                if (!(!_a && !_b && (_c = statelessPlugins_2["return"]))) return [3, 12];
                return [4, _c.call(statelessPlugins_2)];
            case 11:
                _e.sent();
                _e.label = 12;
            case 12: return [3, 14];
            case 13:
                if (e_3) throw e_3.error;
                return [7];
            case 14: return [7];
            case 15: return [4, nginxConf.generateDev()];
            case 16:
                _e.sent();
                return [2];
        }
    });
}); };
//# sourceMappingURL=route-generate.js.map