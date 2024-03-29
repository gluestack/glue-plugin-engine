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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runner = exports.build = void 0;
function build(program, glueStackPlugin) {
    var command = program
        .command("build")
        .argument("[instance-name]", "Name of the container instance to build (optional)")
        .description("Builds provided container instances or all the containers if no instance is provided")
        .action(function (instanceName) { return runner(instanceName, glueStackPlugin); });
}
exports.build = build;
function runner(instanceName, glueStackPlugin) {
    return __awaiter(this, void 0, void 0, function () {
        var instances, buildInstances, found, _i, instances_1, instance, _a, buildInstances_1, instance, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    instances = glueStackPlugin.app.getContainerTypePluginInstances(true);
                    buildInstances = instances;
                    found = false;
                    if (instanceName) {
                        for (_i = 0, instances_1 = instances; _i < instances_1.length; _i++) {
                            instance = instances_1[_i];
                            if (instance.getName() === instanceName) {
                                found = true;
                                buildInstances = [instance];
                                break;
                            }
                        }
                        if (!found) {
                            console.log("Error: could not build ".concat(instanceName, " instance not found"));
                            return [2];
                        }
                    }
                    _a = 0, buildInstances_1 = buildInstances;
                    _b.label = 1;
                case 1:
                    if (!(_a < buildInstances_1.length)) return [3, 7];
                    instance = buildInstances_1[_a];
                    if (!(instance &&
                        instance.callerPlugin.getType() === "stateless" &&
                        (instance === null || instance === void 0 ? void 0 : instance.containerController))) return [3, 6];
                    console.log("Building: ".concat(instance.getName(), " instance"));
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4, instance.containerController.build()];
                case 3:
                    _b.sent();
                    console.log("Success: ".concat(instance.getName(), " instance is build"));
                    return [3, 5];
                case 4:
                    e_1 = _b.sent();
                    console.log("Failed: ".concat(instance.getName(), " instance could not be stopped"));
                    console.log("\x1b[33m\nError:\x1b[31m", e_1.message, "\x1b[0m");
                    return [3, 5];
                case 5:
                    console.log();
                    _b.label = 6;
                case 6:
                    _a++;
                    return [3, 1];
                case 7: return [2];
            }
        });
    });
}
exports.runner = runner;
//# sourceMappingURL=build.js.map