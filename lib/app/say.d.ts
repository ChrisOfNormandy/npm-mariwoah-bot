export = say;
/**
 *
 * @param {import('./objects/MessageData')} data
 * @returns
 */
declare function say(data: import('./objects/MessageData')): Promise<Output>;
import Output = require("./objects/Output");
