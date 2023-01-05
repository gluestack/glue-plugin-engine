"use strict";
exports.__esModule = true;
exports.waitInSeconds = void 0;
var waitInSeconds = function (seconds) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve('done');
        }, seconds * 1000);
    });
};
exports.waitInSeconds = waitInSeconds;
//# sourceMappingURL=wait-in-seconds.js.map