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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chokidar = __importStar(require("chokidar"));
var directory_tree_1 = __importDefault(require("directory-tree"));
var GluestackWatcher = (function () {
    function GluestackWatcher(directoryPath) {
        this.directoryPath = directoryPath;
    }
    GluestackWatcher.prototype.watch = function () {
        chokidar.watch(this.directoryPath, { ignored: /^\./, persistent: true })
            .on('add', function (path) {
            console.log("File ".concat(path, " has been added"));
        })
            .on('change', function (path) {
            console.log("File ".concat(path, " has been changed"));
        })
            .on('unlink', function (path) {
            console.log("File ".concat(path, " has been removed"));
        });
    };
    GluestackWatcher.prototype.getDirectoryTree = function (filepath) {
        var tree = (0, directory_tree_1.default)(filepath, {
            extensions: /\.(js|json|ts)$/,
            exclude: [/node_modules/, /^\./]
        });
        this.trees.push(tree);
    };
    return GluestackWatcher;
}());
exports.default = GluestackWatcher;
//# sourceMappingURL=GluestackWatcher.js.map