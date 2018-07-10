import crypto from 'crypto';
import ecies from 'eth-ecies';
// 加密方法
const encryptRSA = (data, key) => {
    // 注意，第二个参数是Buffer类型
    return crypto.publicEncrypt(key, Buffer.from(data));
};
// 解密方法
const decryptRSA = (encrypted, key) => {
    // 注意，encrypted是Buffer类型
    return crypto.privateDecrypt(key, encrypted);
};
const encryptETH = (publicKey, data) => {
    let userPublicKey = new Buffer(publicKey, 'hex');
    let bufferData = new Buffer(data);
    let encryptedData = ecies.encrypt(userPublicKey, bufferData);

    return encryptedData.toString('base64')
};
const decryptETH = (privateKey, encryptedData) => {
    let userPrivateKey = new Buffer(privateKey, 'hex');
    let bufferEncryptedData = new Buffer(encryptedData, 'base64');
    let decryptedData = ecies.decrypt(userPrivateKey, bufferEncryptedData);

    return decryptedData.toString('utf8');
};
export default {
    encryptRSA,
    decryptRSA,
    encryptETH,
    decryptETH
};