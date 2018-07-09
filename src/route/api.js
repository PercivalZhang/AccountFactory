'use strict';
require("babel-core/register");
require("babel-polyfill");

import path from 'path';
import url from 'url';
import { Router } from 'restify-router';
import fileHelper from '../util/FileHelper';
import accountService from '../service/AccountService';
import Config from "../../config/config";

const Debug = require('debug')('factory:route:api');
export const router = new Router();

const authRequest = async (req, res, next) => {
    try {
        let args = url.parse(req.url, true).query;
        Debug("args:" + JSON.stringify(args));
        if (args) {
            if (args.code) {
                const codes = await fileHelper.readLinesFromFile(path.resolve(__dirname, Config.filePath.authenticatorFile));
                Debug("%s : %s", args.code, codes[0]);
                if (args.code !== codes[0]) {
                    let err = new Error("unauthorized access");
                    res.send(403, err.toString());
                } else {
                    next();
                }
            } else {
                Debug("no code");
                let err = new Error("missing parameters");
                res.send(400, err.toString());
            }
        } else {
            let err = new Error("missing parameters");
            res.send(400, err.toString());
        }
    } catch(error) {
        let err = new Error("authenticate failed");
        res.send(403, err.toString());
    }
};
// this will run before every route on this router
router.use(function (req, res, next) {
    authRequest(req, res, next).then(() => {
        Debug("auth done");
    });
});
/**
 * add new account
 */
router.post('/account', function (req, res, next) {
    Debug(req.body);
    const jsonBody = JSON.parse(req.body);
    const count = jsonBody.count ? parseInt(jsonBody.count) : 1;
    Debug(count);
    accountService.newAccounts(count).then(ret => {
        res.send(200, ret);
        return next();
    })
});
/**
 * get account summary
 */
router.get('/account/summary', function (req, res, next) {
    accountService.getSummary().then(ret => {
        res.send(200, ret);
        return next();
    }).catch(error => {
        res.send(500, error.toString());
        return next();
    })
});