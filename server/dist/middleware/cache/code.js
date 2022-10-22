"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var codeCache = global.codeCache;
if (!codeCache) {
    codeCache = { codes: [] };
}
;
function ModifierCodeCache(code = null) {
    if (code) {
        codeCache.codes.push(code);
    }
    return codeCache;
}
exports.default = ModifierCodeCache;
//# sourceMappingURL=code.js.map