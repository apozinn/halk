import crypto from "crypto-js";

export function Cipher(str, key) {
  const cipherText = crypto.AES.encrypt(str, key).toString();
  return cipherText;
}

export function Decipher(str, key) {
  const bytes = crypto.AES.decrypt(str, key);
  const decipherText = bytes.toString(crypto.enc.Utf8);
  return decipherText;
}
