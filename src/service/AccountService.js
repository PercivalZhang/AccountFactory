'use strict';
require('dotenv').config();
require("babel-core/register");
require("babel-polyfill");

import Web3 from 'web3';
import sequelize from 'sequelize';
import cryptUtil from '../util/Crypt';
import Config from '../../config/config';
import dbconn from '../util/DbConnection';

const Debug = require('debug')('factory:service:account');

Debug("eth network: %s", process.env.NETWORK);

let web3;
let db_tbl_name = 'aaa_address_dev';

if(process.env.NETWORK === 'private') {
    web3 = new Web3(new Web3.providers.HttpProvider(Config.network.private.providerUrl));
} if(process.env.NETWORK === 'main') {
    web3 = new Web3(new Web3.providers.HttpProvider(Config.network.main.providerUrl));
    db_tbl_name = 'aaa_address';
}

web3.eth.net.isListening().then(() => {
    Debug('eth network is connected');
}).catch(err => {
    Debug('failed to connect to eth network: %s', err.toString());
    process.exit(0);
});

const addAccountsIntoDB = (accounts) => {
    let strValues = "";
    for(let i = 0; i < accounts.length; i++) {
        strValues += "('" + accounts[i].address + "', '" + accounts[i].privateKey + "'),"
    }
    if(strValues.length > 0) {
        strValues = strValues.replace(/,$/, '');
        let strSql = "insert into " + db_tbl_name + " (address, privateKey) " +
            "values " + strValues;
        dbconn.query(strSql, function (err, result) {
            if (err)
                Debug("addAccountsIntoDB> %s", err.toString());
            else {
                Debug("Number of records inserted: " + result.affectedRows);
            }
        }).catch(error => {
            Debug("addAccountsIntoDB> %s", error.toString());
        })
    }
};
const generateAccounts = async (count) => {
    let accounts = [];
    let totalCount = 0;
    const AccountCount = count >= 200 ? 200 : count;
    try {
        for (let i = 0; i < AccountCount; i++) {
            let account = web3.eth.accounts.create(web3.utils.randomHex(32));
            const encryptedPK = cryptUtil.encryptETH(Config.cryptPublicKey, account.privateKey);
            accounts.push({address: account.address, privateKey: encryptedPK});
        }
        let results = await dbconn.query(
            'select count(*) as totalCount from ' + db_tbl_name,
            {type: sequelize.QueryTypes.SELECT});
        totalCount = results[0].totalCount;
    } catch(error) {
        Debug("generateAccount>  %s", error.toString());
    } finally {
        Debug("total %s addresses generated", accounts.length);
        addAccountsIntoDB(accounts);
    }
    return {
        "newAdded": accounts.length,
        "totalCountBeforeAdded": totalCount
    }
};
const getAccountSummary = async () => {
    try {
        let results = await dbconn.query(
            'select count(*) as totalCount from aaa_address',
            {type: sequelize.QueryTypes.SELECT});
        Debug("total count: %s", results[0].totalCount);
        return {
            "totalCount": results[0].totalCount
        }
    } catch(error) {
        Debug("generateAccount>  %s", error.toString());
        throw error;
    }
};
export default {
    newAccounts: generateAccounts,
    getSummary: getAccountSummary
};
