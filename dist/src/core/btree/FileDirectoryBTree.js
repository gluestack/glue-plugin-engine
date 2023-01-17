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
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var BTree_1 = __importDefault(require("./BTree"));
var FileDirectoryBTree = (function () {
    function FileDirectoryBTree(order) {
        this.tree = new BTree_1.default(order);
    }
    FileDirectoryBTree.prototype.isFull = function () {
        return this.tree.root.values.length === this.tree.order;
    };
    FileDirectoryBTree.prototype.insert = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var stat, isDirectory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, fs_1.promises.stat(path)];
                    case 1:
                        stat = _a.sent();
                        isDirectory = stat.isDirectory();
                        this.tree.insert({ path: path, isDirectory: isDirectory });
                        return [2];
                }
            });
        });
    };
    FileDirectoryBTree.prototype.search = function (path) {
        var currentNode = this.tree.root;
        while (!currentNode.leaf) {
            var i = 0;
            while (i < currentNode.values.length && currentNode.values[i].path < path) {
                i++;
            }
            currentNode = currentNode.children[i];
        }
        for (var _i = 0, _a = currentNode.values; _i < _a.length; _i++) {
            var element = _a[_i];
            if (element.path === path) {
                return element;
            }
        }
        return null;
    };
    FileDirectoryBTree.prototype.delete = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var currentNode, i_1, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentNode = this.tree.root;
                        while (!currentNode.leaf) {
                            i_1 = 0;
                            while (i_1 < currentNode.values.length && currentNode.values[i_1].path < path) {
                                i_1++;
                            }
                            currentNode = currentNode.children[i_1];
                        }
                        i = 0;
                        while (i < currentNode.values.length && currentNode.values[i].path !== path) {
                            i++;
                        }
                        if (i === currentNode.values.length) {
                            return [2];
                        }
                        currentNode.values.splice(i, 1);
                        if (!currentNode.values[i].isDirectory) return [3, 2];
                        return [4, fs_1.promises.rmdir(path)];
                    case 1:
                        _a.sent();
                        return [3, 4];
                    case 2: return [4, fs_1.promises.unlink(path)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2];
                }
            });
        });
    };
    return FileDirectoryBTree;
}());
exports.default = FileDirectoryBTree;
//# sourceMappingURL=FileDirectoryBTree.js.map