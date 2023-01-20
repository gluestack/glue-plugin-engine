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
exports.__esModule = true;
var chokidar = __importStar(require("chokidar"));
var GluestackWatcher = (function () {
    function GluestackWatcher(paths) {
        this.isRestarting = false;
        this.watcher = chokidar.watch(paths, {
            persistent: true
        });
    }
    GluestackWatcher.prototype.on = function (event, cb) {
        this.watcher.on(event, cb);
    };
    GluestackWatcher.prototype.close = function () {
        this.watcher.close();
    };
    GluestackWatcher.prototype.restart = function (status) {
        this.isRestarting = status;
    };
    GluestackWatcher.prototype.getStatus = function () {
        return this.isRestarting;
    };
    return GluestackWatcher;
}());
exports["default"] = GluestackWatcher;
//# sourceMappingURL=watcher.js.map