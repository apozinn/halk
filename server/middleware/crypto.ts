var CryptoJS = require("crypto-js");

export function Cipher(text, key) {
  const cipherText = CryptoJS.AES.encrypt(text, key).toString();
  return cipherText;
}

export function Decipher(text, key) {
  const bytes = CryptoJS.AES.decrypt(text, key);
  const decipherText = bytes.toString(CryptoJS.enc.Utf8);
  return decipherText;
}
