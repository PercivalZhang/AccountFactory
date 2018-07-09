'use strict';

import fs from 'fs';
import path from 'path';
import { CronJob } from 'cron';
import randomstring from 'randomstring';
import Config from '../../config/config';

const Debug = require('debug')('factory:authenticator');

Debug(__dirname);

new CronJob('*/60 * * * * *', function () {
    const authCode = randomstring.generate({
        length: 10,
        charset: 'hex'
    });
    let filePath = path.resolve(__dirname, Config.filePath.authenticatorFile);
    fs.writeFile(filePath, authCode,  function(err) {
        if (err) {
            Debug(err.toString());
        }
    });
}, null, true, 'Asia/Chongqing');

