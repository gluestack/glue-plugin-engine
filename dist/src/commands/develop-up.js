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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.runner = exports.developUp = void 0;
var colors_1 = __importDefault(require("colors"));
var cli_table3_1 = __importDefault(require("cli-table3"));
var node_path_1 = require("node:path");
var file_exists_1 = require("../helpers/file-exists");
var add_forward_slash_1 = require("../helpers/add-forward-slash");
function developUp(program, glueStackPlugin) {
    var command = program
        .command("develop:up")
        .argument("[instance-name]", "Name of the container instance to up (optional)")
        .description("Starts provided container instances or all the containers if no instance is provided")
        .action(function (instanceName) { return runner(instanceName, glueStackPlugin); });
}
exports.developUp = developUp;
function runner(instanceName, glueStackPlugin) {
    return __awaiter(this, void 0, void 0, function () {
        var instances, upInstances, found, _i, instances_1, instance, table, _a, upInstances_1, instance, paths, isService, routerPath, subRoute, content, _b, content_1, data, routes, pluginData, subRoutes, subMethods, _c, paths_1, _path, _d, routes_1, route, _routePath, e_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    instances = glueStackPlugin.app.getContainerTypePluginInstances(true);
                    upInstances = instances;
                    found = false;
                    if (instanceName) {
                        for (_i = 0, instances_1 = instances; _i < instances_1.length; _i++) {
                            instance = instances_1[_i];
                            if (instance.getName() === instanceName) {
                                found = true;
                                upInstances = [instance];
                                break;
                            }
                        }
                        if (!found) {
                            console.log("Error: could not up ".concat(instanceName, " instance not found"));
                            return [2];
                        }
                    }
                    table = new cli_table3_1["default"]({
                        head: [colors_1["default"].green('Plugin Prefix Route'), colors_1["default"].green('URI Route'), colors_1["default"].green('URI Method')],
                        chars: {
                            'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
                            'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝',
                            'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼',
                            'right': '║', 'right-mid': '╢', 'middle': '│'
                        }
                    });
                    _a = 0, upInstances_1 = upInstances;
                    _e.label = 1;
                case 1:
                    if (!(_a < upInstances_1.length)) return [3, 9];
                    instance = upInstances_1[_a];
                    paths = [];
                    if (!(instance && (instance === null || instance === void 0 ? void 0 : instance.containerController))) return [3, 8];
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 7, , 8]);
                    isService = instance.callerPlugin.getName() === '@gluestack/glue-plugin-service-node';
                    routerPath = (0, node_path_1.join)(process.cwd(), instance.getInstallationPath(), "router.js");
                    subRoute = '';
                    return [4, (0, file_exists_1.fileExists)(routerPath)];
                case 3:
                    if (!(_e.sent())) {
                        return [3, 8];
                    }
                    content = require(routerPath)();
                    if (!content.length) {
                        return [3, 8];
                    }
                    for (_b = 0, content_1 = content; _b < content_1.length; _b++) {
                        data = content_1[_b];
                        if (data.hasOwnProperty("path") && data.path.includes('(.*)')) {
                            paths.push(data.path);
                        }
                        if (data.hasOwnProperty("path") && !data.path.includes('(.*)')) {
                            table.push([
                                data.path,
                                data.proxy.path,
                                '--'
                            ]);
                        }
                    }
                    return [4, instance.containerController.getRoutes()];
                case 4:
                    routes = _e.sent();
                    if (!routes.length) {
                        return [3, 8];
                    }
                    pluginData = void 0;
                    subRoutes = [];
                    subMethods = [];
                    for (_c = 0, paths_1 = paths; _c < paths_1.length; _c++) {
                        _path = paths_1[_c];
                        pluginData = _path.replace('(.*)', '');
                        for (_d = 0, routes_1 = routes; _d < routes_1.length; _d++) {
                            route = routes_1[_d];
                            _routePath = (0, add_forward_slash_1.addForwardSlash)(route.path);
                            if (subRoutes.includes(_routePath)) {
                                continue;
                            }
                            subRoutes.push(_routePath);
                            if (isService) {
                                subMethods.push('ALL');
                            }
                            else {
                                subMethods.push(route.method);
                            }
                        }
                        table.push([
                            pluginData,
                            subRoutes.join("\n"),
                            subMethods.join("\n")
                        ]);
                    }
                    return [4, instance.containerController.getPortNumber()];
                case 5:
                    _e.sent();
                    return [4, instance.containerController.up()];
                case 6:
                    _e.sent();
                    return [3, 8];
                case 7:
                    e_1 = _e.sent();
                    console.log("Failed: ".concat(instance.getName(), " instance could not be started"));
                    console.log("\x1b[33m\nError:\x1b[31m", e_1.message, "\x1b[0m");
                    return [3, 8];
                case 8:
                    _a++;
                    return [3, 1];
                case 9:
                    console.log(table.toString());
                    return [2];
            }
        });
    });
}
exports.runner = runner;
//# sourceMappingURL=develop-up.js.map