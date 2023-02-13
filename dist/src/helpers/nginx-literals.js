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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.setLocation = exports.includeBackend = exports.createRewriteRule = exports.setServer = exports.endsWith = exports.startsWith = void 0;
var DockerodeHelper = require('@gluestack/helpers').DockerodeHelper;
var constants_1 = require("../constants");
var remove_trailing_slash_1 = require("./remove-trailing-slash");
exports.startsWith = "\nevents {\n  worker_connections 1024;\n}\n\nhttp {\n  client_max_body_size 100M;\n  sendfile on;\n";
exports.endsWith = "}\n";
var setServer = function (domain, locations, containsBackend) {
    if (containsBackend === void 0) { containsBackend = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var ports, port;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ports = (0, constants_1.getOccupiedPorts)();
                    return [4, DockerodeHelper.getPort(7000, ports)];
                case 1:
                    port = _a.sent();
                    (0, constants_1.setOccupiedPorts)(__spreadArray(__spreadArray([], ports, true), [port], false));
                    (0, constants_1.setDomainMappings)({ domain: domain, port: port });
                    return [2, "\n  server {\n    listen ".concat(port, ";\n\n    server_name ").concat(domain, ";\n\n    gzip on;\n    gzip_disable \"msie6\";\n\n    gzip_comp_level 6;\n    gzip_min_length 1100;\n    gzip_buffers 16 8k;\n    gzip_proxied any;\n    gzip_types\n        text/plain\n        text/css\n        text/js\n        text/xml\n        text/javascript\n        application/javascript\n        application/json\n        application/xml\n        application/rss+xml\n        image/svg+xml;\n    ").concat(locations.join('\n')).concat(containsBackend ? '\n\n\t\tinclude backend.conf;' : '', "\n  }\n")];
            }
        });
    });
};
exports.setServer = setServer;
var createRewriteRule = function (path, proxy_path) {
    if (!path.startsWith('/backend')) {
        return "rewrite ^".concat(path, " ").concat(proxy_path, " break;");
    }
    return '';
};
exports.createRewriteRule = createRewriteRule;
var includeBackend = function () { return "\n    include backend.conf;\n"; };
exports.includeBackend = includeBackend;
var setLocation = function (path, proxy_instance, proxy_path, host, size_in_mb) {
    var location = path.replace('(.*)', '');
    return "\n    location ".concat((0, remove_trailing_slash_1.removeTrailingSlash)(location), " {\n      ").concat((0, exports.createRewriteRule)(path, proxy_path), "\n\n      client_max_body_size ").concat(size_in_mb || 1, "M;\n\n      proxy_http_version 1.1;\n      proxy_set_header Upgrade $http_upgrade;\n      proxy_set_header Connection \"upgrade\";\n      proxy_cache_bypass $http_upgrade;\n\n      proxy_set_header Host ").concat(host || "$host", ";\n      proxy_set_header X-Real-IP $remote_addr;\n      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n      proxy_set_header X-Forwarded-Proto $scheme;\n\n      proxy_pass http://").concat(proxy_instance, ";\n    }");
};
exports.setLocation = setLocation;
//# sourceMappingURL=nginx-literals.js.map