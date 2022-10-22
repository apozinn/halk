"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decipher = exports.Cipher = void 0;
var CryptoJS = require("crypto-js");
function Cipher(text, key) {
    const cipherText = CryptoJS.AES.encrypt(text, key).toString();
    return cipherText;
}
exports.Cipher = Cipher;
function Decipher(text, key) {
    const bytes = CryptoJS.AES.decrypt(text, key);
    const decipherText = bytes.toString(CryptoJS.enc.Utf8);
    return decipherText;
}
exports.Decipher = Decipher;
//# sourceMappingURL=crypto.js.map