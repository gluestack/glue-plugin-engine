"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSpecialChars = void 0;
var removeSpecialChars = function (str) {
    return str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
};
exports.removeSpecialChars = removeSpecialChars;
//# sourceMappingURL=remove-special-chars.js.map