const Command = require('./objects/Command');

const groups = require('./groups');
const help = require('./help');
const say = require('./say');
const Output = require('./objects/Output');

/**
 *
 * @returns {Command[]}
 */
function getCommandList() {
    let list = [];

    list.push(
        new Command(
            'general',
            'help',
            (data) => help(data, commands.getList())
        )
            .setRegex(/(\?)|(help)/, /\s([\w?]+)/, [1], true)
            .setCommandDescription('Displays a list of commands and syntaxes.')
            .setArgumentDescription(0, 'Command', 'A command string.', true)
            .setSetting('responseClear', { delay: 30 })
            .setSetting('commandClear', { delay: 0 }),
        new Command(
            'general',
            'say',
            say
        )
            .setRegex(/(say)/, /\s(.+)/, [1]),
        new Command(
            'general',
            'print',
            (data) => new Output(data.content.replace(data.bot.prefix + data.command, '').trim()).setValues(data.content.replace(data.bot.prefix + data.command, '').trim()).resolve()
        )
            .setRegex(/(print)/)
    );

    groups.cache.forEach((group) => group.getCommands().forEach((command) => list.push(command)));

    return list;
}

const commands = {
    /**
     * @type {Command[]}
     */
    cache: [],

    /**
     *
     * @returns {Command[]}
     */
    getList() {
        if (!this.cache.length)
            this.cache = getCommandList();

        return this.cache;
    }
};

module.exports = commands;