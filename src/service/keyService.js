'use strict';
require("babel-core/register");
require("babel-polyfill");
require('winston-daily-rotate-file');
import fs from 'fs';
import geth from 'geth';
import Web3 from 'web3';
import keyth from 'keythereum';
import config from 'config';
import { createLogger, format, transports } from 'winston';
const { timestamp, printf } = format;
const Debug = require('debug')('airdrop:keyth');


let params = { keyBytes: 32, ivBytes: 16 };
// synchronous
let dk = keyth.create(params);
Debug(dk);
let password = "wheethereum";
let options = {
    kdf: "pbkdf2",
    cipher: "aes-128-ctr",
    kdfparams: {
        c: 262144,
        dklen: 32,
        prf: "hmac-sha256"
    }
};
// synchronous
let keyObject = keyth.dump(password, dk.privateKey, dk.salt, dk.iv, options);
Debug(keyObject);

const chainHost = config.get('service.chain.private.host');
const chainPort = config.get('service.chain.private.port');
const web3 = new Web3("http://" + chainHost + ":" + chainPort);
/*
let keyObj = keyth.importFromFile("0x6421ccbfb1526a6b0b8734cc8eace45939a47c50", './key-data');
const privateKey = keyth.recover("123456", keyObj).toString("hex");
console.log(privateKey);
*/

let keyObj = keyth.importFromFile("0xe366d4ee1affbe1510cdd4190c02dd0ea7eb2419", './key-data');
const privateKey = keyth.recover("aaachain_2018", keyObj).toString("hex");
console.log(privateKey);

//const account = web3.eth.accounts.privateKeyToAccount(privateKey);
//Debug(account);
