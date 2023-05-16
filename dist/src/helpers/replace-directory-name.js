"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceDirectoryName = void 0;
var replaceDirectoryName = function (str) {
    return str.replace(/[^a-zA-Z0-9\-_]/g, '').toLowerCase();
};
exports.replaceDirectoryName = replaceDirectoryName;
//# sourceMappingURL=replace-directory-name.js.map