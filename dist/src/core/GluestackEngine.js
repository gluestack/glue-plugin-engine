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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var services = require("@gluestack/framework/constants/services");
var HasuraEngine_1 = __importDefault(require("./HasuraEngine"));
var GluestackCron_1 = __importDefault(require("./GluestackCron"));
var DockerCompose_1 = __importDefault(require("./DockerCompose"));
var GluestackRouter_1 = __importDefault(require("./GluestackRouter"));
var GluestackConfig_1 = require("./GluestackConfig");
var path_1 = require("path");
var lodash_1 = require("lodash");
var constants_1 = require("../configs/constants");
var helpers_1 = require("@gluestack/helpers");
var replace_keyword_1 = require("../helpers/replace-keyword");
var replace_directory_name_1 = require("../helpers/replace-directory-name");
var valid_glue_service_1 = require("../helpers/valid-glue-service");
var spawn_1 = require("../helpers/spawn");
var GluestackEngine = (function () {
    function GluestackEngine(app, backendInstancePath) {
        this.actionPlugins = [];
        this.devonlyPlugins = [];
        this.statelessPlugins = [];
        this.app = app;
        this.backendPlugins = constants_1.backendPlugins;
        (0, GluestackConfig_1.setConfig)('backendInstancePath', backendInstancePath);
    }
    GluestackEngine.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hasuraPluginName, hasuraEngine, cron, router;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.collectPlugins('stateless', 'up')];
                    case 1:
                        _a.sent();
                        return [4, this.collectPlugins('devonly', 'up')];
                    case 2:
                        _a.sent();
                        return [4, this.generateRouterJson()];
                    case 3:
                        _a.sent();
                        return [4, this.generateEnv()];
                    case 4:
                        _a.sent();
                        return [4, this.createDockerCompose()];
                    case 5:
                        _a.sent();
                        return [4, this.startDockerCompose()];
                    case 6:
                        _a.sent();
                        hasuraPluginName = (0, GluestackConfig_1.getConfig)('hasuraInstancePath');
                        if (!(hasuraPluginName && hasuraPluginName !== '')) return [3, 14];
                        hasuraEngine = new HasuraEngine_1.default(this.actionPlugins);
                        return [4, hasuraEngine.applyMigrate()];
                    case 7:
                        _a.sent();
                        return [4, hasuraEngine.applyMetadata()];
                    case 8:
                        _a.sent();
                        return [4, hasuraEngine.applyTracks()];
                    case 9:
                        _a.sent();
                        return [4, hasuraEngine.applySeed()];
                    case 10:
                        _a.sent();
                        return [4, hasuraEngine.exportMetadata()];
                    case 11:
                        _a.sent();
                        return [4, hasuraEngine.reapplyActions()];
                    case 12:
                        _a.sent();
                        return [4, hasuraEngine.reapplyEvents()];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14:
                        cron = new GluestackCron_1.default();
                        return [4, cron.start()];
                    case 15:
                        _a.sent();
                        router = new GluestackRouter_1.default();
                        return [4, router.listEndpoints()];
                    case 16:
                        _a.sent();
                        console.log('\n> Note: ');
                        console.log(">  1. In case a table does not exist in Hasura Engine, Gluestack Engine");
                        console.log(">     will skip the event trigger registration.");
                        console.log(">  2. Gluestack Engine drops all existing event triggers, actions & ");
                        console.log(">     custom-types and re-registers them again. (This is to prevent any");
                        console.log(">     issues with the event trigger, custom types & actions)");
                        console.log(">  3. Gluestack Engine will not drop any existing event triggers, actions");
                        console.log(">     & custom-types that were not registered with or by Gluestack Engine.\n");
                        console.log(">  4. Gluestack Engine will not skip/drop any database events, app events or crons");
                        console.log(">     which does not hold valid input against the keys.\n");
                        return [2];
                }
            });
        });
    };
    GluestackEngine.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hasuraPluginName, hasuraInstanceStatus, hasuraEngine;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        process.stdout.write("\u001b[2J\u001b[0;0H");
                        return [4, this.collectPlugins('stateless', 'down')];
                    case 1:
                        _a.sent();
                        return [4, this.collectPlugins('devonly', 'down')];
                    case 2:
                        _a.sent();
                        hasuraPluginName = (0, GluestackConfig_1.getConfig)('hasuraInstancePath');
                        hasuraInstanceStatus = (0, GluestackConfig_1.getConfig)('hasuraInstanceStatus');
                        if (!(hasuraInstanceStatus === 'up' && hasuraPluginName && hasuraPluginName !== '')) return [3, 4];
                        hasuraEngine = new HasuraEngine_1.default(this.actionPlugins);
                        return [4, hasuraEngine.exportMetadata()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4, this.stopDockerCompose()];
                    case 5:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    GluestackEngine.prototype.collectPlugins = function (pluginType, status) {
        var _a, e_1, _b, _c;
        if (pluginType === void 0) { pluginType = 'stateless'; }
        if (status === void 0) { status = 'up'; }
        return __awaiter(this, void 0, void 0, function () {
            var app, arr, instances, validPlugins, _d, instances_1, instances_1_1, instance, type, name, err_1, details, daprServices, instance_1, dbConfig, instance_2, minioConfig, e_1_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        app = this.app;
                        arr = [];
                        instances = app.getContainerTypePluginInstances(false);
                        validPlugins = [];
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 21, 22, 27]);
                        _d = true, instances_1 = __asyncValues(instances);
                        _e.label = 2;
                    case 2: return [4, instances_1.next()];
                    case 3:
                        if (!(instances_1_1 = _e.sent(), _a = instances_1_1.done, !_a)) return [3, 20];
                        _c = instances_1_1.value;
                        _d = false;
                        _e.label = 4;
                    case 4:
                        _e.trys.push([4, , 18, 19]);
                        instance = _c;
                        type = instance === null || instance === void 0 ? void 0 : instance.callerPlugin.getType();
                        name = instance === null || instance === void 0 ? void 0 : instance.callerPlugin.getName();
                        validPlugins.push.apply(validPlugins, (0, valid_glue_service_1.isValidGluePlugin)(this.backendPlugins, name));
                        if (!(instance &&
                            (instance === null || instance === void 0 ? void 0 : instance.containerController) &&
                            type && type === pluginType &&
                            name && validPlugins.includes(name))) return [3, 17];
                        _e.label = 5;
                    case 5:
                        _e.trys.push([5, 7, , 8]);
                        return [4, instance.getContainerController().getPortNumber()];
                    case 6:
                        _e.sent();
                        return [3, 8];
                    case 7:
                        err_1 = _e.sent();
                        return [3, 8];
                    case 8:
                        details = {
                            name: name,
                            type: type,
                            template_folder: instance.callerPlugin.getTemplateFolderPath(),
                            instance: instance.getName(),
                            path: (0, path_1.join)(process.cwd(), instance.getInstallationPath()),
                            instance_object: instance
                        };
                        if (pluginType === 'stateless' && (0, valid_glue_service_1.isDaprService)(name)) {
                            daprServices = (0, GluestackConfig_1.getConfig)('daprServices');
                            daprServices[details.instance] = {
                                name: details.name,
                                path: details.path,
                                instance: details.instance,
                                isService: (0, valid_glue_service_1.isGlueService)(details.name)
                            };
                            (0, GluestackConfig_1.setConfig)('daprServices', daprServices);
                        }
                        if (!!(0, lodash_1.includes)(constants_1.noDockerfiles, details.name)) return [3, 10];
                        return [4, this.collectDockerContext(details, instance)];
                    case 9:
                        _e.sent();
                        _e.label = 10;
                    case 10:
                        if (details.name === '@gluestack/glue-plugin-graphql') {
                            (0, GluestackConfig_1.setConfig)('hasuraInstanceStatus', instance.getContainerController().getStatus());
                            (0, GluestackConfig_1.setConfig)('hasuraInstancePath', details.instance);
                        }
                        if (details.name === '@gluestack/glue-plugin-backend-engine') {
                            (0, GluestackConfig_1.setConfig)('engineInstancePath', details.instance);
                        }
                        if (details.name === '@gluestack/glue-plugin-auth') {
                            (0, GluestackConfig_1.setConfig)('authInstancePath', details.instance);
                        }
                        if (!(details.name === '@gluestack/glue-plugin-postgres')) return [3, 12];
                        instance_1 = details.instance_object;
                        return [4, instance_1.gluePluginStore.get('db_config')];
                    case 11:
                        dbConfig = _e.sent();
                        if (dbConfig.external && dbConfig.external === true) {
                            (0, GluestackConfig_1.setConfig)('isPostgresExternal', 1);
                        }
                        (0, GluestackConfig_1.setConfig)('postgresInstancePath', details.instance);
                        _e.label = 12;
                    case 12:
                        if (!(details.name === '@gluestack/glue-plugin-minio')) return [3, 14];
                        instance_2 = details.instance_object;
                        return [4, instance_2.gluePluginStore.get('minio_credentials')];
                    case 13:
                        minioConfig = _e.sent();
                        if (minioConfig.external && minioConfig.external === true) {
                            (0, GluestackConfig_1.setConfig)('isMinioExternal', 1);
                        }
                        (0, GluestackConfig_1.setConfig)('minioInstancePath', details.instance);
                        _e.label = 14;
                    case 14:
                        if (details.name.startsWith('@gluestack/glue-plugin-service-')) {
                            this.actionPlugins.push(details);
                        }
                        if (!(details.name === '@gluestack/glue-plugin-router-nginx')) return [3, 16];
                        (0, GluestackConfig_1.setConfig)('routerInstancePath', details.instance);
                        (0, GluestackConfig_1.setConfig)('routerPluginName', details.name);
                        return [4, instance.getContainerController().up()];
                    case 15:
                        _e.sent();
                        _e.label = 16;
                    case 16:
                        details.status = instance.getContainerController().setStatus(status);
                        arr.push(details);
                        _e.label = 17;
                    case 17: return [3, 19];
                    case 18:
                        _d = true;
                        return [7];
                    case 19: return [3, 2];
                    case 20: return [3, 27];
                    case 21:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 27];
                    case 22:
                        _e.trys.push([22, , 25, 26]);
                        if (!(!_d && !_a && (_b = instances_1.return))) return [3, 24];
                        return [4, _b.call(instances_1)];
                    case 23:
                        _e.sent();
                        _e.label = 24;
                    case 24: return [3, 26];
                    case 25:
                        if (e_1) throw e_1.error;
                        return [7];
                    case 26: return [7];
                    case 27:
                        if (pluginType === 'stateless') {
                            this.statelessPlugins = arr;
                        }
                        else {
                            this.devonlyPlugins = arr;
                        }
                        return [2];
                }
            });
        });
    };
    GluestackEngine.prototype.createDockerCompose = function () {
        var _a, e_2, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var dockerCompose, plugins, hasuraInstancePath, postgresInstancePath, _d, plugins_1, plugins_1_1, plugin, isPostgresExternal, isMinioExternal, e_2_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        dockerCompose = new DockerCompose_1.default();
                        plugins = __spreadArray(__spreadArray([], this.statelessPlugins, true), this.devonlyPlugins, true);
                        hasuraInstancePath = (0, GluestackConfig_1.getConfig)('hasuraInstancePath');
                        postgresInstancePath = (0, GluestackConfig_1.getConfig)('postgresInstancePath');
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 23, 24, 29]);
                        _d = true, plugins_1 = __asyncValues(plugins);
                        _e.label = 2;
                    case 2: return [4, plugins_1.next()];
                    case 3:
                        if (!(plugins_1_1 = _e.sent(), _a = plugins_1_1.done, !_a)) return [3, 22];
                        _c = plugins_1_1.value;
                        _d = false;
                        _e.label = 4;
                    case 4:
                        _e.trys.push([4, , 20, 21]);
                        plugin = _c;
                        if (!(plugin.name === '@gluestack/glue-plugin-postgres')) return [3, 6];
                        isPostgresExternal = (0, GluestackConfig_1.getConfig)('isPostgresExternal');
                        if (isPostgresExternal === 1) {
                            return [3, 21];
                        }
                        return [4, dockerCompose.addPostgres(plugin)];
                    case 5:
                        _e.sent();
                        return [3, 21];
                    case 6:
                        if (!(plugin.name === '@gluestack/glue-plugin-graphql')) return [3, 8];
                        return [4, dockerCompose.addHasura(plugin, postgresInstancePath)];
                    case 7:
                        _e.sent();
                        return [3, 21];
                    case 8:
                        if (!(plugin.name === '@gluestack/glue-plugin-router-nginx')) return [3, 10];
                        return [4, dockerCompose.addNginx(plugin, hasuraInstancePath)];
                    case 9:
                        _e.sent();
                        return [3, 21];
                    case 10:
                        if (!(plugin.name === '@gluestack/glue-plugin-web')) return [3, 12];
                        return [4, dockerCompose.addWeb(plugin)];
                    case 11:
                        _e.sent();
                        return [3, 21];
                    case 12:
                        if (!(plugin.name === '@gluestack/glue-plugin-minio')) return [3, 14];
                        isMinioExternal = (0, GluestackConfig_1.getConfig)('isMinioExternal');
                        if (isMinioExternal === 1) {
                            return [3, 21];
                        }
                        return [4, dockerCompose.addMinio(plugin)];
                    case 13:
                        _e.sent();
                        return [3, 21];
                    case 14:
                        if (!(plugin.name === '@gluestack/glue-plugin-pg-admin')) return [3, 16];
                        return [4, dockerCompose.addPGAdmin(plugin, postgresInstancePath)];
                    case 15:
                        _e.sent();
                        return [3, 21];
                    case 16:
                        if (!(plugin.name === '@gluestack/glue-plugin-storybook')) return [3, 18];
                        return [4, dockerCompose.addStorybook(plugin)];
                    case 17:
                        _e.sent();
                        return [3, 21];
                    case 18: return [4, dockerCompose.addOthers(plugin)];
                    case 19:
                        _e.sent();
                        return [3, 21];
                    case 20:
                        _d = true;
                        return [7];
                    case 21: return [3, 2];
                    case 22: return [3, 29];
                    case 23:
                        e_2_1 = _e.sent();
                        e_2 = { error: e_2_1 };
                        return [3, 29];
                    case 24:
                        _e.trys.push([24, , 27, 28]);
                        if (!(!_d && !_a && (_b = plugins_1.return))) return [3, 26];
                        return [4, _b.call(plugins_1)];
                    case 25:
                        _e.sent();
                        _e.label = 26;
                    case 26: return [3, 28];
                    case 27:
                        if (e_2) throw e_2.error;
                        return [7];
                    case 28: return [7];
                    case 29: return [4, dockerCompose.generate()];
                    case 30:
                        _e.sent();
                        return [2];
                }
            });
        });
    };
    GluestackEngine.prototype.startDockerCompose = function () {
        return __awaiter(this, void 0, void 0, function () {
            var filepath, folders, projectName, dockerCompose;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filepath = (0, path_1.join)(process.cwd(), 'meta/router');
                        return [4, (0, helpers_1.getOSFolders)()];
                    case 1:
                        folders = _a.sent();
                        projectName = folders[folders.length - 1];
                        dockerCompose = new DockerCompose_1.default();
                        return [4, dockerCompose.start(projectName, filepath)];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    GluestackEngine.prototype.stopDockerCompose = function () {
        return __awaiter(this, void 0, void 0, function () {
            var filepath, folders, projectName, dockerCompose;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filepath = (0, path_1.join)(process.cwd(), 'meta/router');
                        return [4, (0, helpers_1.getOSFolders)()];
                    case 1:
                        folders = _a.sent();
                        projectName = folders[folders.length - 1];
                        dockerCompose = new DockerCompose_1.default();
                        return [4, dockerCompose.stop(projectName, filepath)];
                    case 2:
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
                        return [4, (0, helpers_1.fileExists)(dockerfile)];
                    case 1:
                        if (!(_a.sent())) {
                            console.log("> Could not find Dockerfile for plugin \"".concat(instance.callerPlugin.getName(), "\" instance \"").concat(instance.getName(), "\". Skipping..."));
                            return [2];
                        }
                        return [4, (0, replace_keyword_1.replaceKeyword)(dockerfile, (0, helpers_1.removeSpecialChars)(instance.getName()), '{APP_ID}')];
                    case 2:
                        context = _a.sent();
                        return [4, (0, helpers_1.writeFile)((0, path_1.join)(details.path, 'Dockerfile'), context)];
                    case 3:
                        _a.sent();
                        return [4, (0, replace_keyword_1.replaceKeyword)((0, path_1.join)(details.path, 'Dockerfile'), (0, replace_directory_name_1.replaceDirectoryName)(instance.getName()), '{INSTANCE_NAME}')];
                    case 4:
                        context = _a.sent();
                        return [4, (0, helpers_1.writeFile)((0, path_1.join)(details.path, 'Dockerfile'), context)];
                    case 5:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    GluestackEngine.prototype.generateEnv = function () {
        return __awaiter(this, void 0, void 0, function () {
            var args;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = ['glue', 'env:generate'];
                        return [4, (0, spawn_1.execute)('node', args, {
                                cwd: process.cwd(),
                                shell: true,
                            })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    GluestackEngine.prototype.generateRouterJson = function () {
        return __awaiter(this, void 0, void 0, function () {
            var args;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = [
                            'glue',
                            'route:generate'
                        ];
                        return [4, (0, spawn_1.execute)('node', args, {
                                cwd: process.cwd(),
                                shell: true,
                            })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return GluestackEngine;
}());
exports.default = GluestackEngine;
//# sourceMappingURL=GluestackEngine.js.map