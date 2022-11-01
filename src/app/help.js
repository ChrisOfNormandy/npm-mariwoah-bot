const { chat, embed } = require('./handlers');
const Output = require('./objects/Output');

const { colors } = chat;
const { MessageEmbed } = embed;

/**
 *
 * @param {import('./objects/MessageData')} data
 * @param {import('./objects/Command')[]} list
 * @returns
 */
function help(data, list) {
    const embed = new MessageEmbed()
        .setColor(colors.information);

    if (data.arguments.length) {
        let command = data.arguments[0];

        if (/\?/.test(command))
            command = `\\${command}`;

        embed.setTitle(`Help - ${command}`);

        const cmdSource = list.filter((cmd) => {
            return cmd.getRegex().command !== undefined && cmd.getRegex().command.source.replace(/[/()]/g, '').split(/[|]/g).includes(command) && cmd.enabled;
        });

        if (cmdSource.length) {
            cmdSource.forEach((cmd) => {
                // Command description.
                if (cmd.subcommands.size) {
                    cmd.subcommands.forEach((sc) => {
                        let desc = sc.getDescription();

                        // Command description.
                        let field = `${desc.command || 'No description provided.'}\n`;

                        // Command syntax.
                        field += `**Syntax**\n ${data.prefix}${command} ${sc.name}\n`;

                        // Command argument list.
                        if (desc.arguments.length) {
                            let msg = '';

                            desc.arguments.forEach((arg, i) => {
                                msg += `${arg.optional
                                    ? '_'
                                    : ''}${arg._}: ${arg.d}${arg.optional
                                        ? '_'
                                        : ''}`;

                                if (i < desc.arguments.length - 1)
                                    msg += '\n';
                            });

                            field += `**Arguments**\n ${msg}`;
                            embed.makeFooter('Arguments in italics are optional.');
                        }

                        // Command flag list.
                        if (desc.flags.length) {
                            let msg = '';

                            desc.flags.forEach((flag, i) => {
                                msg += `${flag.optional
                                    ? '_'
                                    : ''}${flag._} : ${flag.d}${flag.optional
                                        ? '_'
                                        : ''}`;

                                if (i < desc.flags.length)
                                    msg += '\n';
                            });

                            field += `**Flags**\n ${msg}`;
                        }

                        embed.makeField(`__${sc.name}__`, field, true);
                    });
                }
                else {
                    embed
                        .makeField('Description', cmd.getDescription().command || 'No description provided.')
                        .makeField('Syntax', `${data.prefix}${cmd.getRegex().command.source.replace(/[/()]/g, '').split(/[|]/g)[0]}`); // Command syntax.

                    let desc = cmd.getDescription();

                    // Command argument list.
                    if (desc.arguments.length) {
                        let msg = '';

                        desc.arguments.forEach((arg, i) => {
                            msg += `${arg.optional
                                ? '_'
                                : ''}${arg._}: ${arg.d}${arg.optional
                                    ? '_'
                                    : ''}`;

                            if (i < desc.arguments.length - 1)
                                msg += '\n';
                        });

                        embed.makeField('Arguments', msg)
                            .makeFooter('Arguments in italics are optional.');
                    }

                    // Command flag list.
                    if (desc.flags.length) {
                        let msg = '';

                        desc.flags.forEach((flag, i) => {
                            msg += `${flag._} : ${flag.d}`;

                            if (i < cmd.description.flags.length)
                                msg += '\n';
                        });

                        embed.makeField('Flags', msg);
                    }
                }
            });
        }
        else {
            /**
             * @type {Map<string, Command[]>}
             */
            let groups = new Map();

            list.forEach((cmd) => {
                if (cmd.getGroup() === command) {
                    if (groups.has(cmd.getGroup()))
                        groups.get(cmd.getGroup()).push(cmd);
                    else
                        groups.set(cmd.getGroup(), [cmd]);
                }
            });

            if (groups.size) {
                groups.forEach((cmdArr, g) => {
                    let msg = '';

                    const arr = cmdArr.filter((cmd, index) => {
                        return cmdArr.findIndex((t) => t.getRegex().command.source === cmd.getRegex().command.source) === index;
                    });

                    const l = arr.length;

                    for (let i = 0; i < l; i++) {
                        if (arr[i].enabled) {
                            msg += arr[i].getRegex().command.source.replace(/[/()]/g, '').replace(/[|]/g, ' | ');

                            if (arr[i].subcommands.size) {
                                msg += '\n';

                                let d = 0;
                                arr[i].subcommands.forEach((v) => {
                                    if (v.enabled) {
                                        msg += `-- ${v.name}`;
                                        if (d < arr[i].subcommands.size - 1)
                                            msg += '\n';
                                    }
                                    d++;
                                });
                            }

                            if (i < cmdArr.length - 1)
                                msg += '\n';
                        }
                    }

                    embed.makeField(g, msg, true);
                });
            }
            else
                embed.makeField('Oops!', `Could not find a command or group matching "${command}".`);
        }
    }
    else {
        embed.setTitle('Help - All');

        /**
         * @type {Map<string, Command[]>}
         */
        let groups = new Map();

        list.forEach((cmd) => {
            if (groups.has(cmd.getGroup()))
                groups.get(cmd.getGroup()).push(cmd);
            else
                groups.set(cmd.getGroup(), [cmd]);
        });

        groups.forEach((cmdArr, g) => {
            let msg = '';

            const arr = cmdArr.filter((cmd, index) => {
                if (cmd.getRegex().command === undefined)
                    return;

                return cmdArr.findIndex((t) => t.getRegex().command !== undefined && t.getRegex().command.source === cmd.getRegex().command.source) === index;
            });

            const l = arr.length;

            for (let i = 0; i < l; i++) {
                if (!arr[i].enabled)
                    continue;

                msg += arr[i].getRegex().command.source.replace(/[/()]/g, '').replace(/[|]/g, ' | ');

                if (arr[i].subcommands.size) {
                    msg += '\n';

                    let d = 0;
                    arr[i].subcommands.forEach((v) => {
                        if (v.enabled) {
                            msg += `-- ${v.name}`;
                            if (d < arr[i].subcommands.size - 1)
                                msg += '\n';
                        }
                        d++;
                    });
                }

                if (i < cmdArr.length - 1)
                    msg += '\n';
            }

            embed.makeField(g, msg, true);
        });
    }

    return new Output()
        .addEmbed(embed)
        .setValues(list)
        .resolve();
}

module.exports = help;
