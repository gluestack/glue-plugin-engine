"use strict";
exports.__esModule = true;
exports.addTrailingSlash = void 0;
var addTrailingSlash = function (str) {
    if (str[str.length - 1] === '/') {
        return str;
    }
    else {
        return str + '/';
    }
};
exports.addTrailingSlash = addTrailingSlash;
//# sourceMappingURL=add-trailing-slash%20copy.js.map