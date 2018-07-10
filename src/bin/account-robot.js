'use strict';

import { CronJob } from 'cron';
import acccountService from '../service/AccountService';

const Debug = require('debug')('factory:account-robot');

Debug(__dirname);

Debug("++++++++++++++load robot+++++++++++++++++");

let count = 30;
const level1 = 10000;
const level2 = 20000;
const level3 = 50000;
const max = 90000;
let ratioLevel1Adjusted = false;
let ratioLevel2Adjusted = false;
let ratioLevel3Adjusted = false;
const level1DampingRatio = 0.8;
const level2DampingRatio = 0.6;
const level3DampingRatio = 0.4;

new CronJob('*/5 * * * *', function () {
    acccountService.newAccounts(count).then(ret => {
        console.log("total account: %s", ret.totalCountBeforeAdded);
        if((ret.totalCountBeforeAdded > 0) && (ret.totalCountBeforeAdded >= level1) && (ratioLevel1Adjusted === false)) {
            Debug("total account reached level-1: %s", ret.totalCountBeforeAdded);
            Debug("adjust count from %s to %s", count, Math.floor(count * level1DampingRatio));
            count = Math.floor(count * level1DampingRatio);
            ratioLevel1Adjusted = true;
        } else if((ret.totalCountBeforeAdded > 0) && (ret.totalCountBeforeAdded >= level2) && !ratioLevel2Adjusted) {
            Debug("total account reached level-2: %s", ret.totalCountBeforeAdded);
            Debug("adjust count from %s to %s", count, Math.floor(count * level2DampingRatio));
            count = Math.floor(count * level2DampingRatio);
            ratioLevel2Adjusted = true;
        } else if((ret.totalCountBeforeAdded > 0) && (ret.totalCountBeforeAdded >= level3) && !ratioLevel3Adjusted) {
            Debug("total account reached level-3: %s", ret.totalCountBeforeAdded);
            Debug("adjust count from %s to %s", count, Math.floor(count * level3DampingRatio));
            count = Math.floor(count * level3DampingRatio);
            ratioLevel3Adjusted = true;
        } else if(ret.totalCountBeforeAdded >= max) {
            Debug("total account reached level-max: %s", ret.totalCountBeforeAdded);
            process.exit(0);
        }
    }).catch(error => {
        Debug(error.toString());
    })
}, null, true, 'Asia/Chongqing');

