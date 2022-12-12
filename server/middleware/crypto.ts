import * as CryptoJS from 'crypto-js';
import * as AES from 'crypto-js/aes';

export function encrypt(data, key) {
	return AES.encrypt(data, key).toString();
}

export function decrypt(data, key) {
	const bytes = AES.decrypt(data, key);
	return bytes.toString(CryptoJS.enc.Utf8);
}