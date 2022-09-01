export = parse;
/**
 *
 * @param {import('../objects/Bot')} bot
 * @param {import('discord.js').Message} message
 * @param {{devEnabled: boolean}} options
 * @returns {Promise<Output>}
 */
declare function parse(bot: import('../objects/Bot'), message: import('discord.js').Message, options: {
    devEnabled: boolean;
}): Promise<Output>;
import Output = require("../objects/Output");
