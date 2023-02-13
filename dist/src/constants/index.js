"use strict";
exports.__esModule = true;
exports.setDomainMappings = exports.getDomainMappings = exports.domainMappings = exports.setOccupiedPorts = exports.getOccupiedPorts = exports.occupiedPorts = exports.server_domain = void 0;
exports.server_domain = '.local.gluestack.app';
exports.occupiedPorts = [];
var getOccupiedPorts = function () { return exports.occupiedPorts; };
exports.getOccupiedPorts = getOccupiedPorts;
var setOccupiedPorts = function (ports) { return exports.occupiedPorts.push.apply(exports.occupiedPorts, ports); };
exports.setOccupiedPorts = setOccupiedPorts;
exports.domainMappings = [];
var getDomainMappings = function () { return exports.domainMappings; };
exports.getDomainMappings = getDomainMappings;
var setDomainMappings = function (mappings) { return exports.domainMappings.push(mappings); };
exports.setDomainMappings = setDomainMappings;
//# sourceMappingURL=index.js.map