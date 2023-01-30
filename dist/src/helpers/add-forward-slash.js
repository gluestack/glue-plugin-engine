"use strict";
exports.__esModule = true;
exports.addForwardSlash = void 0;
var addForwardSlash = function (str) {
    if (str[0] === '/') {
        return str;
    }
    else {
        return '/' + str;
    }
};
exports.addForwardSlash = addForwardSlash;
//# sourceMappingURL=add-forward-slash.js.map