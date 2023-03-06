"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var path_1 = require("path");
var yaml = __importStar(require("yaml"));
var spawn_1 = require("../helpers/spawn");
var GluestackConfig_1 = require("./GluestackConfig");
var helpers_1 = require("@gluestack/helpers");
var DockerCompose = (function () {
    function DockerCompose() {
        this.version = '3.9';
        this.services = {};
    }
    DockerCompose.prototype.toYAML = function () {
        return yaml.stringify({
            version: this.version,
            services: this.services
        });
    };
    DockerCompose.prototype.addService = function (name, service) {
        this.services[(0, helpers_1.removeSpecialChars)(name)] = service;
    };
    DockerCompose.prototype.generate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var directory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        directory = (0, path_1.join)(process.cwd(), 'meta/router');
                        return [4, (0, helpers_1.fileExists)(directory)];
                    case 1:
                        if (!!(_a.sent())) return [3, 3];
                        return [4, (0, helpers_1.createFolder)(directory)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4, (0, helpers_1.writeFile)((0, path_1.join)(directory, 'docker-compose.yml'), this.toYAML())];
                    case 4:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    DockerCompose.prototype.addNginx = function (plugin, hasura) {
        return __awaiter(this, void 0, void 0, function () {
            var instance, name, filepath, data, ports, nginx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = plugin.instance_object;
                        return [4, instance.getName()];
                    case 1:
                        name = _a.sent();
                        filepath = (0, path_1.join)(process.cwd(), 'meta', 'router', name, 'routes.json');
                        return [4, (0, helpers_1.fileExists)(filepath)];
                    case 2:
                        if (!(_a.sent())) {
                            console.log('> No routes.json file found. Skipping nginx container.');
                            return [2];
                        }
                        data = require(filepath);
                        ports = data.map(function (item) { return "".concat(item.port, ":").concat(item.port); });
                        nginx = {
                            container_name: 'nginx',
                            restart: 'always',
                            build: plugin.path,
                            ports: ports,
                            volumes: [
                                "".concat((0, path_1.join)(plugin.path, 'nginx.conf'), ":/etc/nginx/nginx.conf")
                            ]
                        };
                        if (hasura && hasura !== '') {
                            nginx.depends_on = {};
                            nginx.depends_on["".concat(hasura)] = {
                                condition: 'service_healthy'
                            };
                        }
                        this.addService('nginx', nginx);
                        return [2];
                }
            });
        });
    };
    DockerCompose.prototype.addHasura = function (plugin, postgres) {
        return __awaiter(this, void 0, void 0, function () {
            var instance, port_number, isPostgresExternal, hasura;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = plugin.instance_object;
                        return [4, instance.gluePluginStore.get('port_number')];
                    case 1:
                        port_number = _a.sent();
                        isPostgresExternal = (0, GluestackConfig_1.getConfig)('isPostgresExternal');
                        hasura = {
                            container_name: plugin.instance,
                            restart: 'always',
                            image: 'hasura/graphql-engine:v2.16.1',
                            ports: [
                                "".concat(port_number, ":8080")
                            ],
                            volumes: [
                                "".concat(plugin.path, ":/hasura"),
                            ],
                            env_file: [
                                "".concat(plugin.path, "/.env")
                            ],
                            healthcheck: {
                                test: [
                                    "CMD-SHELL",
                                    "timeout 1s bash -c ':> /dev/tcp/127.0.0.1/8080' || exit 1"
                                ],
                                interval: '5s',
                                timeout: '2s',
                                retries: 20
                            }
                        };
                        if (postgres && postgres !== '' && isPostgresExternal === 0) {
                            hasura.depends_on = {};
                            hasura.depends_on["".concat(postgres)] = {
                                condition: 'service_healthy'
                            };
                        }
                        this.addService(plugin.instance, hasura);
                        return [2];
                }
            });
        });
    };
    DockerCompose.prototype.addPostgres = function (plugin) {
        return __awaiter(this, void 0, void 0, function () {
            var instance, port_number, db_config, postgres;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = plugin.instance_object;
                        return [4, instance.gluePluginStore.get('port_number')];
                    case 1:
                        port_number = _a.sent();
                        db_config = instance.gluePluginStore.get('db_config');
                        postgres = {
                            container_name: plugin.instance,
                            restart: 'always',
                            image: 'postgres:12',
                            ports: [
                                "".concat(port_number, ":5432")
                            ],
                            volumes: [
                                "".concat(plugin.path, "/db:/var/lib/postgresql/data/")
                            ],
                            environment: {
                                POSTGRES_USER: "".concat(db_config.username),
                                POSTGRES_PASSWORD: "".concat(db_config.password),
                                POSTGRES_DB: "".concat(db_config.db_name)
                            },
                            healthcheck: {
                                test: [
                                    "CMD-SHELL",
                                    "psql -U ".concat(db_config.username, " -d ").concat(db_config.db_name)
                                ],
                                interval: '10s',
                                timeout: '10s',
                                retries: 50,
                                start_period: '30s'
                            }
                        };
                        this.addService(plugin.instance, postgres);
                        return [2];
                }
            });
        });
    };
    DockerCompose.prototype.addWeb = function (plugin) {
        return __awaiter(this, void 0, void 0, function () {
            var name, instance, port_number, bindingPath, service;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = plugin.instance;
                        instance = plugin.instance_object;
                        return [4, instance.gluePluginStore.get('port_number')];
                    case 1:
                        port_number = _a.sent();
                        bindingPath = (0, path_1.join)(plugin.path, '..');
                        service = {
                            container_name: (0, helpers_1.removeSpecialChars)(plugin.instance),
                            restart: 'unless-stopped',
                            build: plugin.path,
                            ports: [
                                "".concat(port_number, ":9000")
                            ],
                            volumes: [
                                "".concat(bindingPath, ":/gluestack"),
                                "/gluestack/".concat(name, "/node_modules/"),
                                "/gluestack/".concat(name, "/.next/")
                            ]
                        };
                        return [4, (0, helpers_1.fileExists)("".concat(plugin.path, "/.env"))];
                    case 2:
                        if (_a.sent()) {
                            service.env_file = [
                                "".concat(plugin.path, "/.env")
                            ];
                        }
                        this.addService(name, service);
                        return [2];
                }
            });
        });
    };
    DockerCompose.prototype.addMinio = function (plugin) {
        return __awaiter(this, void 0, void 0, function () {
            var instance, port_number, console_port_number, minio_credentials, minio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = plugin.instance_object;
                        return [4, instance.gluePluginStore.get('port_number')];
                    case 1:
                        port_number = _a.sent();
                        return [4, instance.gluePluginStore.get('console_port_number')];
                    case 2:
                        console_port_number = _a.sent();
                        return [4, instance.getContainerController().getEnv()];
                    case 3:
                        minio_credentials = _a.sent();
                        minio = {
                            container_name: plugin.instance,
                            restart: 'always',
                            image: 'minio/minio',
                            command: 'server /data --console-address ":9001"',
                            ports: [
                                "".concat(port_number, ":9000"),
                                "".concat(console_port_number, ":9001"),
                            ],
                            volumes: [
                                "".concat(plugin.path, "/data:/data")
                            ],
                            environment: __assign({}, minio_credentials)
                        };
                        this.addService(plugin.instance, minio);
                        return [2];
                }
            });
        });
    };
    DockerCompose.prototype.addPGAdmin = function (plugin, postgres) {
        return __awaiter(this, void 0, void 0, function () {
            var instance, port_number, isPostgresExternal, pgadmin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = plugin.instance_object;
                        return [4, instance.gluePluginStore.get('port_number')];
                    case 1:
                        port_number = _a.sent();
                        isPostgresExternal = (0, GluestackConfig_1.getConfig)('isPostgresExternal');
                        pgadmin = {
                            container_name: plugin.instance,
                            restart: 'always',
                            image: 'dpage/pgadmin4',
                            ports: [
                                "".concat(port_number, ":80")
                            ],
                            env_file: [
                                "".concat(plugin.path, "/.env")
                            ]
                        };
                        if (postgres && postgres !== '' && isPostgresExternal === 0) {
                            pgadmin.depends_on = {};
                            pgadmin.depends_on["".concat(postgres)] = {
                                condition: 'service_healthy'
                            };
                        }
                        this.addService(plugin.instance, pgadmin);
                        return [2];
                }
            });
        });
    };
    DockerCompose.prototype.addStorybook = function (plugin) {
        return __awaiter(this, void 0, void 0, function () {
            var name, instance, port_number, bindingPath, _a, service;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        name = plugin.instance;
                        instance = plugin.instance_object;
                        return [4, instance.gluePluginStore.get('port_number')];
                    case 1:
                        port_number = _b.sent();
                        bindingPath = (0, path_1.join)(plugin.path, '..');
                        return [4, (0, helpers_1.fileExists)("".concat(plugin.path, "/.env"))];
                    case 2:
                        _a = !(_b.sent());
                        if (_a) return [3, 4];
                        return [4, (0, helpers_1.fileExists)("".concat(plugin.path, "/Dockerfile"))];
                    case 3:
                        _a = !(_b.sent());
                        _b.label = 4;
                    case 4:
                        if (_a) {
                            return [2];
                        }
                        service = {
                            container_name: (0, helpers_1.removeSpecialChars)(plugin.instance),
                            restart: 'always',
                            build: plugin.path,
                            ports: [
                                "".concat(port_number, ":9000")
                            ],
                            volumes: [
                                "".concat(bindingPath, ":/gluestack"),
                                "/gluestack/".concat(name, "/node_modules")
                            ],
                            env_file: [
                                "".concat(plugin.path, "/.env")
                            ]
                        };
                        this.addService(name, service);
                        return [2];
                }
            });
        });
    };
    DockerCompose.prototype.addMobileExpo = function (plugin) {
        return __awaiter(this, void 0, void 0, function () {
            var name, instance, port_number, bindingPath, service;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = plugin.instance;
                        instance = plugin.instance_object;
                        return [4, instance.gluePluginStore.get('port_number')];
                    case 1:
                        port_number = _a.sent();
                        bindingPath = (0, path_1.join)(plugin.path, '..');
                        service = {
                            container_name: (0, helpers_1.removeSpecialChars)(plugin.instance),
                            restart: 'unless-stopped',
                            build: plugin.path,
                            ports: [
                                "".concat(port_number, ":19000")
                            ],
                            volumes: [
                                "".concat(bindingPath, ":/gluestack"),
                                "/gluestack/".concat(name, "/node_modules/")
                            ]
                        };
                        return [4, (0, helpers_1.fileExists)("".concat(plugin.path, "/.env"))];
                    case 2:
                        if (_a.sent()) {
                            service.env_file = [
                                "".concat(plugin.path, "/.env")
                            ];
                        }
                        this.addService(name, service);
                        return [2];
                }
            });
        });
    };
    DockerCompose.prototype.addOthers = function (plugin) {
        return __awaiter(this, void 0, void 0, function () {
            var name, _a, service;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        name = plugin.instance;
                        return [4, (0, helpers_1.fileExists)("".concat(plugin.path, "/.env"))];
                    case 1:
                        _a = !(_b.sent());
                        if (_a) return [3, 3];
                        return [4, (0, helpers_1.fileExists)("".concat(plugin.path, "/Dockerfile"))];
                    case 2:
                        _a = !(_b.sent());
                        _b.label = 3;
                    case 3:
                        if (_a) {
                            return [2];
                        }
                        service = {
                            container_name: (0, helpers_1.removeSpecialChars)(plugin.instance),
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
                }
            });
        });
    };
    DockerCompose.prototype.start = function (projectName, filepath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, spawn_1.execute)('docker', [
                            'compose',
                            '-p',
                            projectName,
                            'up',
                            '--remove-orphans',
                            '-d'
                        ], {
                            cwd: (0, path_1.join)(filepath),
                            stdio: 'inherit',
                            shell: true
                        })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    DockerCompose.prototype.stop = function (projectName, filepath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, spawn_1.execute)('docker', [
                            'compose',
                            '-p',
                            projectName,
                            'down',
                            '--volumes'
                        ], {
                            cwd: filepath,
                            stdio: 'inherit',
                            shell: true
                        })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return DockerCompose;
}());
exports["default"] = DockerCompose;
//# sourceMappingURL=DockerCompose.js.map