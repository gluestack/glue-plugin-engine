"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.__esModule = true;
exports.DockerCompose = void 0;
var path_1 = require("path");
var yaml = __importStar(require("yaml"));
var fs_1 = require("fs");
var DockerCompose = (function () {
    function DockerCompose(backendInstancePath) {
        this.version = '3.9';
        this.services = {};
        this.backendInstancePath = backendInstancePath;
    }
    DockerCompose.prototype.toYAML = function () {
        return yaml.stringify({
            version: this.version,
            services: this.services
        });
    };
    DockerCompose.prototype.addService = function (name, service) {
        this.services[name] = service;
    };
    DockerCompose.prototype.generate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, fs_1.writeFileSync)((0, path_1.join)(process.cwd(), this.backendInstancePath, 'engine/router', 'docker-compose.yml'), this.toYAML());
                return [2];
            });
        });
    };
    DockerCompose.prototype.addNginx = function (plugin) {
        return __awaiter(this, void 0, void 0, function () {
            var nginx;
            return __generator(this, function (_a) {
                nginx = {
                    container_name: 'nginx',
                    restart: 'always',
                    build: (0, path_1.join)(plugin.path, 'router'),
                    ports: [
                        '9090:80'
                    ],
                    volumes: [
                        "".concat((0, path_1.join)(plugin.path, 'router', 'nginx.conf'), ":/etc/nginx/nginx.conf")
                    ]
                };
                this.addService('nginx', nginx);
                return [2];
            });
        });
    };
    DockerCompose.prototype.addHasura = function (plugin) {
        return __awaiter(this, void 0, void 0, function () {
            var hasura;
            return __generator(this, function (_a) {
                hasura = {
                    container_name: plugin.instance,
                    restart: 'always',
                    image: 'hasura/graphql-engine:v2.16.1',
                    ports: [
                        '8080:8080'
                    ],
                    volumes: [
                        "".concat(plugin.path, ":/hasura"),
                    ],
                    env_file: [
                        "".concat(plugin.path, "/.env")
                    ]
                };
                this.addService(plugin.instance, hasura);
                return [2];
            });
        });
    };
    DockerCompose.prototype.addOthers = function (plugin) {
        return __awaiter(this, void 0, void 0, function () {
            var name, service;
            return __generator(this, function (_a) {
                name = plugin.instance;
                service = {
                    container_name: plugin.instance,
                    restart: 'always',
                    build: plugin.path,
                    volumes: [
                        "".concat(plugin.path, ":/server"),
                        "/server/node_modules"
                    ],
                    env_file: [
                        "".concat(plugin.path, "/.env")
                    ]
                };
                this.addService(name, service);
                return [2];
            });
        });
    };
    return DockerCompose;
}());
exports.DockerCompose = DockerCompose;
exports["default"] = DockerCompose;
//# sourceMappingURL=DockerCompose.js.map