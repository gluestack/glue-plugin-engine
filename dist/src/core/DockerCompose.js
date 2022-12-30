"use strict";
exports.__esModule = true;
var DockerComposeServices = (function () {
    function DockerComposeServices(name, context, ports, volumes, environment) {
        this.name = name;
        this.context = context;
        this.ports = ports;
        this.volumes = volumes;
        this.environment = environment;
    }
    return DockerComposeServices;
}());
exports["default"] = DockerComposeServices;
//# sourceMappingURL=DockerCompose.js.map