'use strict';

import { CronJob } from 'cron';
import acccountService from '../service/AccountService';

const Debug = require('debug')('factory:account-robot');

Debug(__dirname);

Debug("++++++++++++++load robot+++++++++++++++++");

let count = 2;
const max = 50000;

new CronJob('*/20 * * * * *', function () {
    console.log("add newAccounts...");
    acccountService.newAccounts(count).then(ret => {
        console.log("total account: %s", ret.totalCountBeforeAdded);
        if(ret.totalCountBeforeAdded >= max) {
            Debug("total account reached level-max: %s", ret.totalCountBeforeAdded);
            process.exit(0);
        }
    }).catch(error => {
        Debug(error.toString());
    });
}, null, true, 'Asia/Chongqing');

