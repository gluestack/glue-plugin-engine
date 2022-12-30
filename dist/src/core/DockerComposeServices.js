"use strict";
exports.__esModule = true;
exports.Service = exports.DockerCompose = void 0;
var DockerCompose = (function () {
    function DockerCompose() {
    }
    return DockerCompose;
}());
exports.DockerCompose = DockerCompose;
var Service = (function () {
    function Service(name, build, ports, volumes, env_file, depends_on, restart) {
        if (restart === void 0) { restart = 'always'; }
        this.restart = 'always';
        this.name = name;
        this.build = build;
        this.ports = ports;
        this.volumes = volumes;
        this.env_file = env_file;
        this.depends_on = depends_on;
        this.restart = restart;
    }
    Service.prototype.toJSON = function () {
    };
    Service.prototype.toYAML = function () {
    };
    return Service;
}());
exports.Service = Service;
exports["default"] = DockerCompose;
//# sourceMappingURL=DockerComposeServices.js.map