"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const CryptoJS = require("crypto-js");
const AES = require("crypto-js/aes");
function encrypt(data, key) {
    return AES.encrypt(data, key).toString();
}
exports.encrypt = encrypt;
function decrypt(data, key) {
    const bytes = AES.decrypt(data, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}
exports.decrypt = decrypt;
//# sourceMappingURL=crypto.js.map