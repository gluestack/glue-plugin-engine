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
        while (_) try {
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
var NginxConf_1 = __importDefault(require("./NginxConf"));
var HasuraEngine_1 = __importDefault(require("./HasuraEngine"));
var GluestackCron_1 = __importDefault(require("./GluestackCron"));
var DockerCompose_1 = __importDefault(require("./DockerCompose"));
var GluestackConfig_1 = require("./GluestackConfig");
var path_1 = require("path");
var write_file_1 = require("../helpers/write-file");
var constants_1 = require("../configs/constants");
var wait_in_seconds_1 = require("../helpers/wait-in-seconds");
var replace_keyword_1 = require("../helpers/replace-keyword");
var remove_special_chars_1 = require("../helpers/remove-special-chars");
var GluestackEngine = (function () {
    function GluestackEngine(app, backendInstancePath) {
        this.engineExist = false;
        this.app = app;
        this.actionPlugins = [];
        this.backendPlugins = (0, constants_1.backendPlugins)();
        (0, GluestackConfig_1.setConfig)('backendInstancePath', backendInstancePath);
    }
    GluestackEngine.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hasuraPluginName, hasuraEngine, cron;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.collectPlugins()];
                    case 1:
                        _a.sent();
                        return [4, this.createDockerCompose()];
                    case 2:
                        _a.sent();
                        return [4, this.createNginxConfig()];
                    case 3:
                        _a.sent();
                        if (!this.engineExist) return [3, 5];
                        return [4, this.startDockerCompose()];
                    case 4:
                        _a.sent();
                        return [3, 6];
                    case 5:
                        console.log('> Engine does not exist. Skipping docker-compose start.');
                        _a.label = 6;
                    case 6:
                        hasuraPluginName = (0, GluestackConfig_1.getConfig)('hasuraInstancePath');
                        if (!(hasuraPluginName && hasuraPluginName !== '')) return [3, 13];
                        hasuraEngine = new HasuraEngine_1["default"](this.actionPlugins);
                        return [4, hasuraEngine.applyMigrate()];
                    case 7:
                        _a.sent();
                        return [4, hasuraEngine.applyMetadata()];
                    case 8:
                        _a.sent();
                        return [4, hasuraEngine.applyTracks()];
                    case 9:
                        _a.sent();
                        return [4, hasuraEngine.exportMetadata()];
                    case 10:
                        _a.sent();
                        return [4, hasuraEngine.reapplyActions()];
                    case 11:
                        _a.sent();
                        return [4, hasuraEngine.reapplyEvents()];
                    case 12:
                        _a.sent();
                        console.log('\n> Note: ');
                        console.log(">  1. In case a table does not exist in Hasura Engine, Gluestack Engine");
                        console.log(">     will skip the event trigger registration.");
                        console.log(">  2. Gluestack Engine drops all existing event triggers, actions & ");
                        console.log(">     custom-types and re-registers them again. (This is to prevent any");
                        console.log(">     issues with the event trigger, custom types & actions)");
                        console.log(">  3. Gluestack Engine will not drop any existing event triggers, actions");
                        console.log(">     & custom-types that are not registered by Gluestack Engine.\n");
                        _a.label = 13;
                    case 13:
                        cron = new GluestackCron_1["default"]();
                        return [4, cron.start()];
                    case 14:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    GluestackEngine.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.stopDockerCompose();
                return [2];
            });
        });
    };
    GluestackEngine.prototype.createNginxConfig = function () {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var backendInstancePath, plugins, nginxConf, plugins_1, plugins_1_1, plugin, e_1_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        backendInstancePath = (0, GluestackConfig_1.getConfig)('backendInstancePath');
                        plugins = this.statelessPlugins;
                        nginxConf = new NginxConf_1["default"]();
                        nginxConf.addRouter((0, path_1.join)(process.cwd(), backendInstancePath, 'router.js'));
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, 8, 13]);
                        plugins_1 = __asyncValues(plugins);
                        _b.label = 2;
                    case 2: return [4, plugins_1.next()];
                    case 3:
                        if (!(plugins_1_1 = _b.sent(), !plugins_1_1.done)) return [3, 6];
                        plugin = plugins_1_1.value;
                        return [4, nginxConf.addRouter((0, path_1.join)(plugin.path, 'router.js'))];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [3, 2];
                    case 6: return [3, 13];
                    case 7:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 13];
                    case 8:
                        _b.trys.push([8, , 11, 12]);
                        if (!(plugins_1_1 && !plugins_1_1.done && (_a = plugins_1["return"]))) return [3, 10];
                        return [4, _a.call(plugins_1)];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [3, 12];
                    case 11:
                        if (e_1) throw e_1.error;
                        return [7];
                    case 12: return [7];
                    case 13: return [4, nginxConf.generate()];
                    case 14:
                        _b.sent();
                        return [2];
                }
            });
        });
    };
    GluestackEngine.prototype.collectPlugins = function () {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function () {
            var app, arr, instances, instances_1, instances_1_1, instance, type, name_1, details, e_2_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        app = this.app;
                        arr = [];
                        instances = app.getContainerTypePluginInstances(false);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 9, 10, 15]);
                        instances_1 = __asyncValues(instances);
                        _b.label = 2;
                    case 2: return [4, instances_1.next()];
                    case 3:
                        if (!(instances_1_1 = _b.sent(), !instances_1_1.done)) return [3, 8];
                        instance = instances_1_1.value;
                        type = instance === null || instance === void 0 ? void 0 : instance.callerPlugin.getType();
                        name_1 = instance === null || instance === void 0 ? void 0 : instance.callerPlugin.getName();
                        if (!(instance &&
                            (instance === null || instance === void 0 ? void 0 : instance.containerController) &&
                            type && type === 'stateless' &&
                            name_1 && this.backendPlugins.includes(name_1))) return [3, 7];
                        details = {
                            name: name_1,
                            type: type,
                            template_folder: instance.callerPlugin.getTemplateFolderPath(),
                            instance: instance.getName(),
                            path: (0, path_1.join)(process.cwd(), instance.getInstallationPath()),
                            status: instance.getContainerController().getStatus()
                        };
                        if (!(details.name !== '@gluestack/glue-plugin-graphql')) return [3, 5];
                        return [4, this.collectDockerContext(details, instance)];
                    case 4:
                        _b.sent();
                        return [3, 6];
                    case 5:
                        (0, GluestackConfig_1.setConfig)('hasuraInstancePath', details.instance);
                        _b.label = 6;
                    case 6:
                        if (details.name !== '@gluestack/glue-plugin-engine') {
                            (0, GluestackConfig_1.setConfig)('engineInstancePath', details.instance);
                        }
                        if (details.name !== '@gluestack/glue-plugin-auth') {
                            (0, GluestackConfig_1.setConfig)('authInstancePath', details.instance);
                        }
                        if (details.name === '@gluestack/glue-plugin-functions.action') {
                            this.actionPlugins.push(details);
                        }
                        arr.push(details);
                        _b.label = 7;
                    case 7: return [3, 2];
                    case 8: return [3, 15];
                    case 9:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3, 15];
                    case 10:
                        _b.trys.push([10, , 13, 14]);
                        if (!(instances_1_1 && !instances_1_1.done && (_a = instances_1["return"]))) return [3, 12];
                        return [4, _a.call(instances_1)];
                    case 11:
                        _b.sent();
                        _b.label = 12;
                    case 12: return [3, 14];
                    case 13:
                        if (e_2) throw e_2.error;
                        return [7];
                    case 14: return [7];
                    case 15:
                        this.statelessPlugins = arr;
                        return [2];
                }
            });
        });
    };
    GluestackEngine.prototype.createDockerCompose = function () {
        var e_3, _a;
        return __awaiter(this, void 0, void 0, function () {
            var dockerCompose, plugins, plugins_2, plugins_2_1, plugin, e_3_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        dockerCompose = new DockerCompose_1["default"]();
                        plugins = this.statelessPlugins;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 12]);
                        plugins_2 = __asyncValues(plugins);
                        _b.label = 2;
                    case 2: return [4, plugins_2.next()];
                    case 3:
                        if (!(plugins_2_1 = _b.sent(), !plugins_2_1.done)) return [3, 5];
                        plugin = plugins_2_1.value;
                        if (plugin.name === '@gluestack/glue-plugin-graphql') {
                            dockerCompose.addHasura(plugin);
                            (0, GluestackConfig_1.setConfig)('hasuraInstancePath', plugin.instance);
                            return [3, 4];
                        }
                        if (plugin.name === '@gluestack/glue-plugin-engine') {
                            this.engineExist = true;
                            dockerCompose.addNginx(plugin);
                            (0, GluestackConfig_1.setConfig)('engineInstancePath', plugin.instance);
                        }
                        dockerCompose.addOthers(plugin);
                        _b.label = 4;
                    case 4: return [3, 2];
                    case 5: return [3, 12];
                    case 6:
                        e_3_1 = _b.sent();
                        e_3 = { error: e_3_1 };
                        return [3, 12];
                    case 7:
                        _b.trys.push([7, , 10, 11]);
                        if (!(plugins_2_1 && !plugins_2_1.done && (_a = plugins_2["return"]))) return [3, 9];
                        return [4, _a.call(plugins_2)];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [3, 11];
                    case 10:
                        if (e_3) throw e_3.error;
                        return [7];
                    case 11: return [7];
                    case 12: return [4, dockerCompose.generate()];
                    case 13:
                        _b.sent();
                        return [2];
                }
            });
        });
    };
    GluestackEngine.prototype.startDockerCompose = function () {
        return __awaiter(this, void 0, void 0, function () {
            var backendInstancePath, filepath, folders, lastFolder, projectName, dockerCompose;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        backendInstancePath = (0, GluestackConfig_1.getConfig)('backendInstancePath');
                        filepath = (0, path_1.join)(process.cwd(), backendInstancePath, 'engine/router');
                        folders = process.cwd().split('/');
                        lastFolder = folders[folders.length - 1];
                        projectName = "".concat(lastFolder, "_").concat(backendInstancePath);
                        dockerCompose = new DockerCompose_1["default"]();
                        return [4, dockerCompose.start(projectName, filepath)];
                    case 1:
                        _a.sent();
                        return [4, (0, wait_in_seconds_1.waitInSeconds)(2)];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    GluestackEngine.prototype.stopDockerCompose = function () {
        return __awaiter(this, void 0, void 0, function () {
            var backendInstancePath, filepath, folders, lastFolder, projectName, dockerCompose;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        backendInstancePath = (0, GluestackConfig_1.getConfig)('backendInstancePath');
                        filepath = (0, path_1.join)(process.cwd(), backendInstancePath, 'engine/router');
                        folders = process.cwd().split('/');
                        lastFolder = folders[folders.length - 1];
                        projectName = "".concat(lastFolder, "_").concat(backendInstancePath);
                        dockerCompose = new DockerCompose_1["default"]();
                        return [4, dockerCompose.stop(projectName, filepath)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    GluestackEngine.prototype.collectDockerContext = function (details, instance) {
        return __awaiter(this, void 0, void 0, function () {
            var dockerfile, context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dockerfile = (0, path_1.join)(process.cwd(), 'node_modules', instance.callerPlugin.getName(), 'src/assets/Dockerfile');
                        return [4, (0, replace_keyword_1.replaceKeyword)(dockerfile, (0, remove_special_chars_1.removeSpecialChars)(instance.getName()), '{APP_ID}')];
                    case 1:
                        context = _a.sent();
                        return [4, (0, write_file_1.writeFile)((0, path_1.join)(details.path, 'Dockerfile'), context)];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return GluestackEngine;
}());
exports["default"] = GluestackEngine;
//# sourceMappingURL=GluestackEngine.js.map