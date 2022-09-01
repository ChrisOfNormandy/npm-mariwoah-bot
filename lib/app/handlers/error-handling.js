"use strict";
const Output = require('../objects/Output');
/**
 *
 * @param {Error} err
 * @param {function(*):void} reject
 * @returns
 */
function errOuput(err, reject) {
    return new Output().handleCatch(err, reject);
}
module.exports = {
    errOuput
};
