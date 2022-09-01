export = help;
/**
 *
 * @param {import('./objects/MessageData')} data
 * @param {import('./objects/Command')[]} list
 * @returns
 */
declare function help(data: import('./objects/MessageData'), list: import('./objects/Command')[]): Promise<Output>;
import Output = require("./objects/Output");
