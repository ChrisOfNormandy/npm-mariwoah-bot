"use strict";
const commands = require('../commands');
const Output = require('../objects/Output');
const MessageData = require('../objects/MessageData');
/**
 *
 * @param {import('../objects/Bot')} bot
 * @param {string} content
 * @param {import('discord.js').Message} message
 * @param {Output} ingest
 * @param {MessageData} ingestData
 * @returns {Promise<Output>}
 */
function parseString(bot, content, message, ingest = undefined, ingestData = undefined) {
    const validCommands = commands.getList().filter((cmd) => !!cmd.getRegex().command &&
        new RegExp(`${bot.prefix}(${cmd.getRegex().command.source})`).test(content));
    if (!validCommands.length)
        return new Output()
            .setOption('output', false)
            .setError(new Error('Valid commands length was 0.'))
            .reject();
    let index = 0, finished = false;
    let data = new MessageData(bot, content, message.member, ingest, ingestData);
    let regex, commandStringRegex, subCommandRegex, str;
    while (!finished && index < validCommands.length) {
        regex = validCommands[index].getRegex();
        commandStringRegex = `${bot.prefix}(${regex.command.source})`;
        subCommandRegex = '';
        if (data.hasData) {
            if (validCommands[index].subcommands.size) {
                subCommandRegex = `${Array.from(validCommands[index].subcommands.keys()).map((sc) => { return `(\\s(${sc}))`; }).join('|')}`;
                commandStringRegex += subCommandRegex;
            }
            else {
                if (regex.arguments)
                    commandStringRegex += `(${regex.arguments.source})${regex.argsOptional
                        ? '?'
                        : ''}`;
            }
        }
        let commandRegex = new RegExp(commandStringRegex);
        if (!commandRegex.test(data.content)) {
            index++;
            continue;
        }
        else {
            // Remove prefix.
            str = data.content.slice(1);
            // Fetch and remove command.
            const c = str.match(regex.command);
            str = str.replace(c[0], '');
            data.setCommand(c[0]);
            // Fetch and remove subcommand.
            if (data.hasData) {
                let sc = null;
                if (validCommands[index].subcommands.size) {
                    sc = str.match(new RegExp(subCommandRegex));
                    if (sc !== null) {
                        str = str.replace(sc[0], '');
                        data.setSubcommand(sc.filter((x) => { return x !== undefined && x !== sc[0]; })[0]);
                    }
                }
                // Fetch and remove arguments.
                let args = [];
                if (regex.arguments) {
                    let match = str.match(regex.arguments);
                    if (match === null) {
                        if (!validCommands[index].regex.argsOptional)
                            return new Output()
                                .setError(new Error('Missing arguments.'))
                                .reject();
                    }
                    else {
                        str = str.replace(args[0], '');
                        let argList = [];
                        validCommands[index].getRegex().argumentIndexes.forEach((v) => {
                            if (match[v])
                                argList.push(match[v]);
                        });
                        data.setArguments(...argList);
                    }
                }
                else if (validCommands[index].subcommands.size) {
                    let argRegX = validCommands[index].getSubcommand(data.subcommand).getRegex().arguments;
                    if (argRegX) {
                        let match = str.match(argRegX);
                        if (match === null) {
                            if (!validCommands[index].getSubcommand(data.subcommand).getRegex().argsOptional)
                                return new Output()
                                    .setError(new Error('Missing arguments.'))
                                    .reject();
                        }
                        else
                            validCommands[index].getSubcommand(data.subcommand).getRegex().argumentIndexes.forEach((v) => { if (match[v])
                                data.arguments.push(match[v]); });
                    }
                }
            }
            finished = true;
            if (!validCommands[index].enabled)
                return new Output()
                    .setOption('output', false)
                    .setError(new Error('Command not enabled.'))
                    .reject();
            if (!!validCommands[index].adminOnly && !data.admin)
                return new Output()
                    .setOption('output', false)
                    .setError(new Error('User lacks admin permissions.'))
                    .reject();
            if (bot.config.settings.dev.enabled)
                console.log('Command:', validCommands[index]);
            return new Promise((resolve, reject) => {
                validCommands[index].func(message, data)
                    .then((output) => {
                    data.outputs.forEach((v) => {
                        data.setVar(v, output.values[output.values[data.indexes[v]] || 0]);
                    });
                    if (data.pipedCommand !== null) {
                        parseString(bot, data.pipedCommand, message, output, data)
                            .then((response) => resolve(response))
                            .catch((err) => reject(err));
                    }
                    else
                        resolve(output);
                })
                    .catch((err) => reject(err));
            });
        }
    }
    return new Output()
        .setOption('output', false)
        .setError(new Error('Failed to parse.'))
        .reject();
}
/**
 *
 * @param {Error} err
 * @param {import('discord.js').Message} message
 * @param {*} options
 * @param {function(*):void} reject
 */
function onParseError(err, message, options, reject) {
    if (err.error === null) {
        err.getContent().forEach((msg) => {
            if (msg)
                message.channel.send(msg);
        });
        if (options.devEnabled)
            reject(err.getErrors());
        else
            reject(null);
    }
    else {
        try {
            if (err.options.has('output') && err.options.get('output')) {
                err.getContent().forEach((msg) => {
                    if (msg)
                        message.channel.send(msg);
                });
                if (options.devEnabled)
                    reject(err.getErrors());
                else
                    reject(null);
            }
            else if (options.devEnabled)
                console.error(err);
        }
        catch (e) {
            console.error(err);
            reject(err);
        }
    }
}
/**
 *
 * @param {import('../objects/Bot')} bot
 * @param {import('discord.js').Message} message
 * @param {{devEnabled: boolean}} options
 * @returns {Promise<Output>}
 */
function parse(bot, message, options) {
    const prefixCheck = new RegExp(`^${bot.prefix}`);
    if (!prefixCheck.test(message.content))
        return Promise.reject(null);
    return new Promise((resolve, reject) => {
        parseString(bot, message.content, message)
            .then((response) => {
            /**
             *
             * @param {Output} output
             */
            const send = (output) => {
                message.reply(output.getContent())
                    .then((msg) => {
                    if (output.options.has('clear'))
                        setTimeout(() => msg.delete().catch((err) => reject(err)), output.options.get('clear').delay * 1000);
                })
                    .catch((err) => {
                    console.error('Failed to send!', err);
                    reject(err);
                });
            };
            if (Array.isArray(response))
                response.forEach((output) => send(output));
            else
                send(response);
            resolve(response);
        })
            .catch((err) => {
            console.log('FAILED TO PARSE COMMAND.');
            console.error(err);
            if (err !== null)
                onParseError(err, message, options, reject);
        });
    });
}
module.exports = parse;
