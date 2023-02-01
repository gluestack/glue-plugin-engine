"use strict";
exports.__esModule = true;
exports.removeTrailingSlash = void 0;
var removeTrailingSlash = function (str) {
    if (str !== "/") {
        return str.replace(/\/$/, "");
    }
    return str;
};
exports.removeTrailingSlash = removeTrailingSlash;
//# sourceMappingURL=remove-trailing-slash.js.map