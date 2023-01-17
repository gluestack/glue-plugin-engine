"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BTreeNode_1 = __importDefault(require("./BTreeNode"));
var BTree = (function () {
    function BTree(order) {
        this.order = order;
        this.root = new BTreeNode_1.default(this.order, true);
    }
    BTree.prototype.insert = function (value) {
        if (this.root.isFull()) {
            var newRoot = new BTreeNode_1.default(this.order, false);
            newRoot.children.push(this.root);
            this.root = newRoot;
            this.root.splitChild();
        }
        this.root.insertNonFull(value);
    };
    BTree.prototype.search = function (value) {
        return this.root.search(value);
    };
    BTree.prototype.delete = function (value) {
        this.root.delete(value);
        if (this.root.values.length === 0 && !this.root.leaf) {
            this.root = this.root.children[0];
        }
    };
    return BTree;
}());
exports.default = BTree;
//# sourceMappingURL=BTree.js.map