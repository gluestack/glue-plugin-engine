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
exports.GlueStackPlugin = void 0;
var package_json_1 = __importDefault(require("../package.json"));
var PluginInstance_1 = require("./PluginInstance");
var route_generate_1 = require("./commands/route-generate");
var develop_list_1 = require("./commands/develop-list");
var develop_watch_1 = require("./commands/develop-watch");
var develop_up_1 = require("./commands/develop-up");
var develop_down_1 = require("./commands/develop-down");
var build_1 = require("./commands/build");
var GlueStackPlugin = (function () {
    function GlueStackPlugin(app, gluePluginStore) {
        this.type = "stateless";
        this.app = app;
        this.instances = [];
        this.gluePluginStore = gluePluginStore;
    }
    GlueStackPlugin.prototype.init = function () {
        var _this = this;
        this.app.addCommand(function (program) { return (0, develop_list_1.developList)(program, _this); });
        this.app.addCommand(function (program) { return (0, develop_up_1.developUp)(program, _this); });
        this.app.addCommand(function (program) { return (0, develop_down_1.developDown)(program, _this); });
        this.app.addCommand(function (program) { return (0, develop_watch_1.developWatch)(program, _this); });
        this.app.addCommand(function (program) { return (0, build_1.build)(program, _this); });
        this.app.addCommand(function (program) { return (0, route_generate_1.routeGenerate)(program, _this); });
    };
    GlueStackPlugin.prototype.destroy = function () {
    };
    GlueStackPlugin.prototype.getName = function () {
        return package_json_1["default"].name;
    };
    GlueStackPlugin.prototype.getVersion = function () {
        return package_json_1["default"].version;
    };
    GlueStackPlugin.prototype.getType = function () {
        return this.type;
    };
    GlueStackPlugin.prototype.getTemplateFolderPath = function () {
        return "".concat(process.cwd(), "/node_modules/").concat(this.getName(), "/template");
    };
    GlueStackPlugin.prototype.getInstallationPath = function (target) {
        return "";
    };
    GlueStackPlugin.prototype.runPostInstall = function (instanceName, target) {
        return __awaiter(this, void 0, void 0, function () {
            var devProcessManagerPlugin;
            return __generator(this, function (_a) {
                devProcessManagerPlugin = this.app.getPluginByName("@gluestack/glue-plugin-dev-process-manager");
                if (devProcessManagerPlugin &&
                    devProcessManagerPlugin.getInstances() &&
                    devProcessManagerPlugin.getInstances()[0]) {
                    throw new Error("Dev process manager instance already installed as ".concat(devProcessManagerPlugin
                        .getInstances()[0]
                        .getName()));
                }
                return [2];
            });
        });
    };
    GlueStackPlugin.prototype.createInstance = function (key, gluePluginStore, installationPath) {
        var instance = new PluginInstance_1.PluginInstance(this.app, this, key, gluePluginStore, installationPath);
        this.instances.push(instance);
        return instance;
    };
    GlueStackPlugin.prototype.getInstances = function () {
        return this.instances;
    };
    return GlueStackPlugin;
}());
exports.GlueStackPlugin = GlueStackPlugin;
//# sourceMappingURL=index.js.map