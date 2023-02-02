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
var create_tree_1 = require("../helpers/create-tree");
var file_exists_1 = require("../helpers/file-exists");
var routeGenerate = function (program, glueStackPlugin) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        program
            .command("route:generate")
            .description("Generates router file for all the container instances")
            .action(function () { return (0, exports.runner)(glueStackPlugin); });
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
                return [4, (0, file_exists_1.fileExists)(metaPluginsPath)];
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
var runner = function (glueStackPlugin) { return __awaiter(void 0, void 0, void 0, function () {
    var tree, statelessPlugins, app, meta, instancesAndTree, plugins, _i, _a, pluginName, _b, _c, instanceName, instance, packageJSON, peerDependencies, _d, _e, dependency, dataTree, packages, instances, _f, instances_1, instances_1_1, instance, type, name_1, details, _g, e_1_1, nginxConf, _h, statelessPlugins_1, statelessPlugins_1_1, plugin, e_2_1;
    var _j, e_1, _k, _l, _m, e_2, _o, _p;
    return __generator(this, function (_q) {
        switch (_q.label) {
            case 0:
                tree = {};
                statelessPlugins = [];
                app = glueStackPlugin.app;
                return [4, (0, exports.metaPlugins)()];
            case 1:
                meta = _q.sent();
                instancesAndTree = app.getContainerTypePluginInstances(false, true);
                plugins = instancesAndTree.tree;
                _i = 0, _a = Object.keys(plugins);
                _q.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3, 7];
                pluginName = _a[_i];
                tree[pluginName] = [];
                _b = 0, _c = Object.keys(plugins[pluginName]);
                _q.label = 3;
            case 3:
                if (!(_b < _c.length)) return [3, 6];
                instanceName = _c[_b];
                instance = plugins[pluginName][instanceName];
                packageJSON = (0, path_1.join)(instance.callerPlugin.getTemplateFolderPath(), '..', 'package.json');
                return [4, (0, file_exists_1.fileExists)(packageJSON)];
            case 4:
                if (!(_q.sent()))
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
                _q.label = 5;
            case 5:
                _b++;
                return [3, 3];
            case 6:
                _i++;
                return [3, 2];
            case 7: return [4, (0, create_tree_1.createTree)(tree, 1)];
            case 8:
                dataTree = _q.sent();
                if (dataTree.length <= 0) {
                    console.log('> No package installed, please install at least one stateless or stateful package!');
                    process.exit(0);
                }
                packages = dataTree.map(function (node) { return node.name; });
                instances = instancesAndTree.instances;
                _q.label = 9;
            case 9:
                _q.trys.push([9, 18, 19, 24]);
                _f = true, instances_1 = __asyncValues(instances);
                _q.label = 10;
            case 10: return [4, instances_1.next()];
            case 11:
                if (!(instances_1_1 = _q.sent(), _j = instances_1_1.done, !_j)) return [3, 17];
                _l = instances_1_1.value;
                _f = false;
                _q.label = 12;
            case 12:
                _q.trys.push([12, , 15, 16]);
                instance = _l;
                type = instance === null || instance === void 0 ? void 0 : instance.callerPlugin.getType();
                name_1 = instance === null || instance === void 0 ? void 0 : instance.callerPlugin.getName();
                if (!(instance && type && name_1 &&
                    (instance === null || instance === void 0 ? void 0 : instance.containerController) &&
                    type === 'stateless' && packages.includes(name_1))) return [3, 14];
                details = {
                    name: name_1,
                    type: type,
                    instance: instance.getName()
                };
                if (name_1 === '@gluestack/glue-plugin-backend-engine') {
                    details.path = (0, path_1.join)(process.cwd(), instance.getInstallationPath(), '..');
                }
                else {
                    details.path = (0, path_1.join)(process.cwd(), instance.getInstallationPath());
                }
                details.status = instance.getContainerController().getStatus();
                _g = details;
                return [4, instance.getContainerController().getPortNumber()];
            case 13:
                _g.port = _q.sent();
                statelessPlugins.push(details);
                _q.label = 14;
            case 14: return [3, 16];
            case 15:
                _f = true;
                return [7];
            case 16: return [3, 10];
            case 17: return [3, 24];
            case 18:
                e_1_1 = _q.sent();
                e_1 = { error: e_1_1 };
                return [3, 24];
            case 19:
                _q.trys.push([19, , 22, 23]);
                if (!(!_f && !_j && (_k = instances_1["return"]))) return [3, 21];
                return [4, _k.call(instances_1)];
            case 20:
                _q.sent();
                _q.label = 21;
            case 21: return [3, 23];
            case 22:
                if (e_1) throw e_1.error;
                return [7];
            case 23: return [7];
            case 24:
                nginxConf = new nginx_conf_1["default"]();
                _q.label = 25;
            case 25:
                _q.trys.push([25, 33, 34, 39]);
                _h = true, statelessPlugins_1 = __asyncValues(statelessPlugins);
                _q.label = 26;
            case 26: return [4, statelessPlugins_1.next()];
            case 27:
                if (!(statelessPlugins_1_1 = _q.sent(), _m = statelessPlugins_1_1.done, !_m)) return [3, 32];
                _p = statelessPlugins_1_1.value;
                _h = false;
                _q.label = 28;
            case 28:
                _q.trys.push([28, , 30, 31]);
                plugin = _p;
                return [4, nginxConf.addRouter(plugin.instance, plugin.port, (0, path_1.join)(plugin.path, 'router.js'))];
            case 29:
                _q.sent();
                return [3, 31];
            case 30:
                _h = true;
                return [7];
            case 31: return [3, 26];
            case 32: return [3, 39];
            case 33:
                e_2_1 = _q.sent();
                e_2 = { error: e_2_1 };
                return [3, 39];
            case 34:
                _q.trys.push([34, , 37, 38]);
                if (!(!_h && !_m && (_o = statelessPlugins_1["return"]))) return [3, 36];
                return [4, _o.call(statelessPlugins_1)];
            case 35:
                _q.sent();
                _q.label = 36;
            case 36: return [3, 38];
            case 37:
                if (e_2) throw e_2.error;
                return [7];
            case 38: return [7];
            case 39: return [4, nginxConf.generate()];
            case 40:
                _q.sent();
                return [2];
        }
    });
}); };
exports.runner = runner;
//# sourceMappingURL=route-generate.js.map