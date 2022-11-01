"use strict";
/**
 *
 * @param {string} char
 * @returns
 */
function widthText(char = '#') {
    return char.repeat(process.stdout.columns);
}
/**
 *
 * @param {Error} err
 * @param {string} header
 */
function error(err, header = null) {
    console.error(widthText(), `\nAn error has occurred:\n${header !== null
        ? `${header}`
        : 'Unknown cause.'}\n`, err, `\n\n${widthText()}`);
}
const logging = {
    error
};
module.exports = { logging };
