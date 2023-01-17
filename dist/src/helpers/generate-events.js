"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
var generateEvents = function (events) { var _a, events_1, events_1_1; return __awaiter(void 0, void 0, void 0, function () {
    var body, addOrUpdateEvent, removeEvent, event_1, e_1_1;
    var _b, e_1, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                body = {};
                addOrUpdateEvent = {
                    columns: '*',
                    payload: '*'
                };
                removeEvent = {
                    columns: '*'
                };
                _e.label = 1;
            case 1:
                _e.trys.push([1, 6, 7, 12]);
                _a = true, events_1 = __asyncValues(events);
                _e.label = 2;
            case 2: return [4, events_1.next()];
            case 3:
                if (!(events_1_1 = _e.sent(), _b = events_1_1.done, !_b)) return [3, 5];
                _d = events_1_1.value;
                _a = false;
                try {
                    event_1 = _d;
                    if (event_1 === 'insert') {
                        body.insert = addOrUpdateEvent;
                    }
                    if (event_1 === 'update') {
                        body.update = addOrUpdateEvent;
                    }
                    if (event_1 === 'delete') {
                        body.delete = removeEvent;
                    }
                }
                finally {
                    _a = true;
                }
                _e.label = 4;
            case 4: return [3, 2];
            case 5: return [3, 12];
            case 6:
                e_1_1 = _e.sent();
                e_1 = { error: e_1_1 };
                return [3, 12];
            case 7:
                _e.trys.push([7, , 10, 11]);
                if (!(!_a && !_b && (_c = events_1.return))) return [3, 9];
                return [4, _c.call(events_1)];
            case 8:
                _e.sent();
                _e.label = 9;
            case 9: return [3, 11];
            case 10:
                if (e_1) throw e_1.error;
                return [7];
            case 11: return [7];
            case 12: return [2, body];
        }
    });
}); };
var generate = function (table, sourceName, events) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = {
                    type: 'pg_create_event_trigger'
                };
                _a = [{ name: "".concat(table, "_trigger"), table: {
                            name: table,
                            schema: 'public'
                        }, source: sourceName, webhook: '{{EVENT_BASE_URL}}', replace: false, cleanup_config: {
                            schedule: "0 0 * * *",
                            batch_size: 10000,
                            clear_older_than: 168,
                            timeout: 60,
                            clean_invocation_logs: false,
                            paused: false
                        } }];
                return [4, generateEvents(events)];
            case 1: return [2, (_b.args = __assign.apply(void 0, _a.concat([(_c.sent())])),
                    _b)];
        }
    });
}); };
exports.generate = generate;
//# sourceMappingURL=generate-events.js.map