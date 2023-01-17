"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BTreeNode = (function () {
    function BTreeNode(order, leaf) {
        this.order = order;
        this.values = [];
        this.children = [];
        this.leaf = leaf;
        this.parent = null;
    }
    BTreeNode.prototype.isFull = function () {
        return this.values.length === this.order;
    };
    BTreeNode.prototype.splitChild = function () {
        var newChild = new BTreeNode(this.order, this.leaf);
        newChild.leaf = this.children[0].leaf;
        newChild.values = this.children[0].values.splice(this.order);
        if (!this.leaf) {
            newChild.children = this.children[0].children.splice(this.order);
        }
        this.children[0] = newChild;
    };
    BTreeNode.prototype.insertNonFull = function (value) {
        var i = this.values.length - 1;
        if (this.leaf) {
            while (i >= 0 && this.values[i] > value) {
                i--;
            }
            this.values.splice(i + 1, 0, value);
        }
        else {
            while (i >= 0 && this.values[i] > value) {
                i--;
            }
            i++;
            if (this.children[i].isFull()) {
                this.splitChild();
                if (this.values[i] < value) {
                    i++;
                }
            }
            this.children[i].insertNonFull(value);
        }
    };
    BTreeNode.prototype.search = function (value) {
        var i = 0;
        while (i < this.values.length && this.values[i] < value) {
            i++;
        }
        if (i < this.values.length && this.values[i] === value) {
            return this;
        }
        if (this.leaf) {
            return null;
        }
        return this.children[i].search(value);
    };
    BTreeNode.prototype.delete = function (value) {
        var index = this.values.indexOf(value);
        if (index !== -1) {
            if (this.leaf) {
                this.values.splice(index, 1);
                if (this.parent && this.values.length < Math.floor(this.order / 2)) {
                    this.parent.mergeChildren(this);
                }
            }
            else {
                var left = this.children[index];
                var right = this.children[index + 1];
                if (left.values.length >= Math.ceil(this.order / 2)) {
                    var pred = left;
                    while (!pred.leaf) {
                        pred = pred.children[pred.children.length - 1];
                    }
                    this.values[index] = pred.values[pred.values.length - 1];
                    left.delete(pred.values[pred.values.length - 1]);
                }
                else if (right.values.length >= Math.ceil(this.order / 2)) {
                    var succ = right;
                    while (!succ.leaf) {
                        succ = succ.children[0];
                    }
                    this.values[index] = succ.values[0];
                    right.delete(succ.values[0]);
                }
                else {
                    left.values.push(this.values[index]);
                    left.values = left.values.concat(right.values);
                    left.children = left.children.concat(right.children);
                    this.values.splice(index, 1);
                    this.children.splice(index + 1, 1);
                    left.delete(value);
                }
            }
        }
        else {
            if (!this.leaf) {
                var i = 0;
                while (i < this.values.length && value > this.values[i]) {
                    i++;
                }
                if (this.children[i].isFull()) {
                    this.splitChild();
                    if (value > this.values[i]) {
                        i++;
                    }
                }
                this.children[i].delete(value);
            }
        }
    };
    BTreeNode.prototype.mergeChildren = function (node) {
        var _a;
        var index = this.children.indexOf(node);
        if (index !== -1) {
            if (index > 0 && this.children[index - 1].values.length > Math.floor(this.order / 2)) {
                node.values.unshift(this.values[index - 1]);
                this.values[index - 1] = this.children[index - 1].values.pop();
                node.children.unshift(this.children[index - 1].children.pop());
            }
            else if (index < this.children.length - 1 && this.children[index + 1].values.length > Math.floor(this.order / 2)) {
                node.values.push(this.values[index]);
                this.values[index] = this.children[index + 1].values.shift();
                node.children.push(this.children[index + 1].children.shift());
            }
            else {
                if (index > 0) {
                    this.children[index - 1].values = this.children[index - 1].values.concat(node.values);
                    this.children[index - 1].values.push(this.values[index - 1]);
                    this.children[index - 1].children = this.children[index - 1].children.concat(node.children);
                    this.values.splice(index - 1, 1);
                    this.children.splice(index, 1);
                    this.mergeChildren(this.children[index - 1]);
                }
                else {
                    this.children[index + 1].values.unshift(this.values[index]);
                    this.children[index + 1].values = node.values.concat(this.children[index + 1].values);
                    (_a = this.children[index + 1].children).unshift.apply(_a, node.children);
                    this.values.splice(index, 1);
                    this.children.splice(index, 1);
                    this.mergeChildren(this.children[index]);
                }
            }
        }
    };
    return BTreeNode;
}());
exports.default = BTreeNode;
//# sourceMappingURL=BTreeNode.js.map