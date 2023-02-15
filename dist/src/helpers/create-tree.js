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
exports.__esModule = true;
exports.createTree = void 0;
var createTree = function (userData, depthLevel) {
    if (depthLevel === void 0) { depthLevel = 0; }
    return __awaiter(void 0, void 0, void 0, function () {
        function getDepth(node, depth) {
            if (depth === void 0) { depth = 0; }
            if (!node.children.length) {
                return depth;
            }
            var maxDepth = depth;
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var child = _a[_i];
                var childDepth = getDepth(child, depth + 1);
                maxDepth = Math.max(maxDepth, childDepth);
            }
            return maxDepth;
        }
        function getChildrenAtDepth(node, targetDepth, currentDepth) {
            if (currentDepth === void 0) { currentDepth = 0; }
            if (currentDepth === targetDepth) {
                return [node];
            }
            var childrenAtDepth = [];
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var child = _a[_i];
                childrenAtDepth = childrenAtDepth.concat(getChildrenAtDepth(child, targetDepth, currentDepth + 1));
            }
            return childrenAtDepth;
        }
        function insertDataRecursive(nodeName, currentNode) {
            return __awaiter(this, void 0, void 0, function () {
                var k, v, ntmp, i;
                return __generator(this, function (_a) {
                    if (!Object.keys(userData).length)
                        return [2];
                    for (k in userData) {
                        v = userData[k];
                        if (v[0] == nodeName && v.length == 1) {
                            ntmp = new MyNode(k);
                            currentNode.addChild(ntmp);
                            delete userData[k];
                        }
                    }
                    for (i = 0; i < currentNode.children.length; i++) {
                        insertDataRecursive(currentNode.children[i].name, currentNode.children[i]);
                    }
                    return [2];
                });
            });
        }
        function createRootNode() {
            return __awaiter(this, void 0, void 0, function () {
                var rootNode;
                return __generator(this, function (_a) {
                    rootNode = new MyNode("root");
                    return [2, rootNode];
                });
            });
        }
        function reduceTreeResolveKnowsWithWeights(rootNode) {
            return __awaiter(this, void 0, void 0, function () {
                function is_all_deps_loaded(v, v_map) {
                    for (var i = 0; i < v.length; i++) {
                        if (!v_map[v[i]])
                            return false;
                    }
                    return true;
                }
                function select_max_weighed_ones(v_map) {
                    var selected = [];
                    var max_value = -1;
                    for (var k in v_map) {
                        if (v_map.hasOwnProperty(k)) {
                            if (max_value < v_map[k])
                                max_value = v_map[k];
                        }
                    }
                    for (var k in v_map) {
                        if (v_map.hasOwnProperty(k)) {
                            if (v_map[k] == max_value)
                                selected.push(k);
                        }
                    }
                    return selected;
                }
                var k, max_matched_depth, node_name, v, v_map, j, totalDepth, i, childrens, x, list_of_deps_deepest;
                return __generator(this, function (_a) {
                    for (k in userData) {
                        max_matched_depth = 0;
                        node_name = '';
                        v = userData[k];
                        v_map = [];
                        for (j = 0; j < v.length; j++) {
                            totalDepth = getDepth(rootNode);
                            for (i = 0; i < totalDepth; i++) {
                                childrens = getChildrenAtDepth(rootNode, i);
                                for (x = 0; x < childrens.length; x++) {
                                    if (childrens[x].name == v[j]) {
                                        v_map[childrens[x].name] = i;
                                    }
                                }
                            }
                        }
                        if (is_all_deps_loaded(v, v_map)) {
                            list_of_deps_deepest = select_max_weighed_ones(v_map);
                            userData[k] = [list_of_deps_deepest[0]];
                        }
                    }
                    return [2];
                });
            });
        }
        function main() {
            return __awaiter(this, void 0, void 0, function () {
                var rootNode, max_depth;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, createRootNode()];
                        case 1:
                            rootNode = _a.sent();
                            max_depth = 1000;
                            Object.keys(userData).forEach(function (_pluginName) {
                                if (!userData[_pluginName].length) {
                                    userData[_pluginName].push('root');
                                }
                            });
                            _a.label = 2;
                        case 2:
                            if (!(max_depth > 0 && Object.keys(userData).length)) return [3, 5];
                            max_depth--;
                            return [4, insertDataRecursive("root", rootNode)];
                        case 3:
                            _a.sent();
                            return [4, reduceTreeResolveKnowsWithWeights(rootNode)];
                        case 4:
                            _a.sent();
                            return [3, 2];
                        case 5:
                            if (max_depth < 0) {
                                console.log('unable to resolve plugin depth - giving up after 1000 depth');
                                process.exit(-1);
                            }
                            return [2, rootNode];
                    }
                });
            });
        }
        var MyNode, node;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    MyNode = (function () {
                        function MyNode(_name) {
                            this.children = [];
                            this.name = _name;
                        }
                        MyNode.prototype.addChild = function (child) {
                            this.children.push(child);
                        };
                        MyNode.prototype.removeChild = function (child) {
                            var index = this.children.indexOf(child);
                            if (index !== -1) {
                                this.children.splice(index, 1);
                            }
                        };
                        return MyNode;
                    }());
                    return [4, main()];
                case 1:
                    node = _a.sent();
                    return [4, getChildrenAtDepth(node, depthLevel)];
                case 2: return [2, _a.sent()];
            }
        });
    });
};
exports.createTree = createTree;
//# sourceMappingURL=create-tree.js.map