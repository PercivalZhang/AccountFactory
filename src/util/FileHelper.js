"use strict";
require("babel-core/register");
require("babel-polyfill");

import fs from 'fs';
import readline from 'readline';
/*
 * read the file into lines
 */
const readLinesFromFile =  (pathFile) => {
    return new Promise((resolve, reject) => {
        try {
            const rd = readline.createInterface({
                input: fs.createReadStream(pathFile),
            });
            let lines = [];
            rd.on('line', function (tokenCode) {
                lines.push(tokenCode);
            }).on('close', function () {
                resolve(lines);
            });
        } catch(error) {
            reject(error);
        }
    });
};

export default {
    readLinesFromFile
};