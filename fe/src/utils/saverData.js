import CryptoJS from 'crypto-js';

const cipherCodeKey = import.meta.env.VITE_CIPHER;
const IVKey = import.meta.env.VITE_IVKEY;


export const encryptMessage = (message) => {
    console.log(cipherCodeKey,IVKey)
    if (typeof message !== 'string') {
        throw new Error('Message must be a string');
    }

    const key = CryptoJS.enc.Hex.parse(cipherCodeKey);
    const iv = CryptoJS.enc.Hex.parse(IVKey);

    const encrypted = CryptoJS.AES.encrypt(message, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    const cipherMsg = encrypted.ciphertext.toString(CryptoJS.enc.Hex);

    return cipherMsg;
};

export const decryptMessage = (cipherMessage) => {
    if (typeof cipherMessage !== 'string') {
        throw new Error('Ciphertext must be a string');
    }

    const key = CryptoJS.enc.Hex.parse(cipherCodeKey);

    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Hex.parse(cipherMessage) },
        key,
        {
            iv: CryptoJS.enc.Hex.parse(IVKey),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
};
