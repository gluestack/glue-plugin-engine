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
exports.routesList = void 0;
var colors_1 = __importDefault(require("colors"));
var cli_table3_1 = __importDefault(require("cli-table3"));
var node_path_1 = require("node:path");
var file_exists_1 = require("../helpers/file-exists");
var add_forward_slash_1 = require("../helpers/add-forward-slash");
function routesList(upInstances, isUp) {
    return __awaiter(this, void 0, void 0, function () {
        var table, _i, upInstances_1, instance, paths, isService, routerPath, content, _a, content_1, data, routes, pluginData, subRoutes, subMethods, _b, paths_1, _path, _c, routes_1, route, _routePath, e_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    table = new cli_table3_1["default"]({
                        head: [colors_1["default"].green('Plugin Prefix Route'), colors_1["default"].green('URI Route'), colors_1["default"].green('URI Method')],
                        chars: {
                            'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
                            'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝',
                            'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼',
                            'right': '║', 'right-mid': '╢', 'middle': '│'
                        }
                    });
                    _i = 0, upInstances_1 = upInstances;
                    _d.label = 1;
                case 1:
                    if (!(_i < upInstances_1.length)) return [3, 16];
                    instance = upInstances_1[_i];
                    paths = [];
                    if (!(instance && (instance === null || instance === void 0 ? void 0 : instance.containerController))) return [3, 15];
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 14, , 15]);
                    isService = instance.callerPlugin.getName() === '@gluestack/glue-plugin-service-node';
                    routerPath = (0, node_path_1.join)(process.cwd(), instance.getInstallationPath(), "router.js");
                    return [4, (0, file_exists_1.fileExists)(routerPath)];
                case 3:
                    if (!!(_d.sent())) return [3, 5];
                    return [4, runUpCommand(instance, isUp)];
                case 4:
                    _d.sent();
                    return [3, 15];
                case 5:
                    content = require(routerPath)();
                    if (!!content.length) return [3, 7];
                    return [4, runUpCommand(instance, isUp)];
                case 6:
                    _d.sent();
                    return [3, 15];
                case 7:
                    for (_a = 0, content_1 = content; _a < content_1.length; _a++) {
                        data = content_1[_a];
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
                    if (!(typeof instance.containerController.getRoutes !== 'function')) return [3, 9];
                    return [4, runUpCommand(instance, isUp)];
                case 8:
                    _d.sent();
                    return [3, 15];
                case 9: return [4, instance.containerController.getRoutes()];
                case 10:
                    routes = _d.sent();
                    if (!!routes.length) return [3, 12];
                    return [4, runUpCommand(instance, isUp)];
                case 11:
                    _d.sent();
                    return [3, 15];
                case 12:
                    pluginData = void 0;
                    subRoutes = [];
                    subMethods = [];
                    for (_b = 0, paths_1 = paths; _b < paths_1.length; _b++) {
                        _path = paths_1[_b];
                        pluginData = _path.replace('(.*)', '');
                        for (_c = 0, routes_1 = routes; _c < routes_1.length; _c++) {
                            route = routes_1[_c];
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
                    return [4, runUpCommand(instance, isUp)];
                case 13:
                    _d.sent();
                    return [3, 15];
                case 14:
                    e_1 = _d.sent();
                    console.log("Failed: ".concat(instance.getName(), " instance could not be started"));
                    console.log("\x1b[33m\nError:\x1b[31m", e_1.message, "\x1b[0m");
                    return [3, 15];
                case 15:
                    _i++;
                    return [3, 1];
                case 16:
                    console.log(table.toString());
                    return [2];
            }
        });
    });
}
exports.routesList = routesList;
var runUpCommand = function (instance, isUp) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isUp) return [3, 3];
                return [4, instance.containerController.getPortNumber()];
            case 1:
                _a.sent();
                return [4, instance.containerController.up()];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2];
        }
    });
}); };
//# sourceMappingURL=route-list.js.map