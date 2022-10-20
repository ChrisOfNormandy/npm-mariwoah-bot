const urlRegex = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;

const flagRegex = /\s-[a-zA-Z]+\b/g;

const userMentionsRegex = /<@!\d{18}>/g;
const roleMentionsRegex = /<@&\d{18}>/g;

const variableRegex = /\{\w+(\[\d+\])?\}/g;
const variableRegex_ = /\{(\w+)(\[(\d+)\])?\}/;

const varOutputRegex = /(.+?)\s?>\s?(\w+)/;
const pipedCommandRegex = /(.+?)\s?\|\s?(.+)/;
const ternaryRegex = /(.+?)\s?\?\s?(.+?)\s?:\s?(.+?)/

class MessageData {
    /**
     *
     * @param {string} content
     */
    build(content) {
        let str = content;

        let mentions = content.match(userMentionsRegex);
        if (mentions !== null) {
            for (let m in mentions) {
                this.mentions.push(mentions[m].match(/\d{18}/)[0]);
                str = str.replace(mentions[m], `<USER:${m}>`);
            }
        }

        let roles = content.match(roleMentionsRegex);
        if (roles !== null) {
            for (let m in roles) {
                this.roles.push(roles[m].match(/\d{18}/)[0]);
                str = str.replace(roles[m], `<ROLE:${m}>`);
            }
        }

        const urls = content.match(urlRegex);
        if (urls !== null) {
            for (let url in urls) {
                this.urls.push(urls[url]);
                str = str.replace(urls[url], `<URL:${url}>`);
            }
        }

        const flags_ = str.match(flagRegex);
        if (flags_ !== null) {
            for (let flag in flags_) {
                str = str.replace(flags_[flag], '');
                flags_[flag] = flags_[flag].slice(2);

                if (flags_[flag].length > 1) {
                    let arr = flags_[flag].split('');
                    for (let i in arr)
                        if (!this.flags.has(arr[i]))
                            this.flags.set(arr[i], true);
                }
                else
                    this.flags.set(flags_[flag], true);
            }
        }

        const variables = content.match(variableRegex);
        if (variables !== null) {
            for (let v in variables) {
                const m = variables[v].match(variableRegex_);

                let val = m[1];
                this.variables.push(val);

                let p = this.getVar(val);

                if (m[3])
                    p = p[m[3]];

                if (this.checkVarNot(val, null))
                    str = str.replace(variables[v], p);
            }
        }

        this.content = str;
    }

    /**
     *
     * @param  {...string} args
     */
    setArguments(...args) {
        this.arguments = args;
    }

    /**
     *
     * @param {string} cmd
     */
    setCommand(cmd) {
        this.command = cmd;
    }

    /**
     *
     * @param {string} sCmd
     */
    setSubcommand(sCmd) {
        this.subcommand = sCmd;
    }

    /**
     *
     * @param {string} content
     */
    setContent(content) {
        this.content = content;
    }

    setVar(key, value) {
        this.vars[key] = value;
    }

    getVar(key) {
        return this.vars[key];
    }

    checkVar(key, eq) {
        return this.vars[key] === eq;
    }

    checkVarNot(key, eq) {
        return this.vars[key] !== eq;
    }

    /**
     *
     * @param {import('./Bot')} bot
     * @param {string} content
     * @param {import('discord.js').GuildMember} member
     * @param {import('./Output')} ingest
     * @param {import('./MessageData')} ingestData
     */
    constructor(bot, content, member, ingest = undefined, ingestData = undefined) {
        this.bot = bot;

        this.content = content;

        this.command = null;
        this.subcommand = null;

        this.arguments = [];
        this.variables = [];
        this.mentions = [];
        this.roles = [];
        this.urls = [];

        this.flags = new Map();
        this.vars = {};
        this.indexes = {};
        this.outputs = [];

        this.admin = member.permissions.has('Administrator');

        this.hasData = true;

        this.ingest = ingest;

        this.pipedCommand = null;

        if (ingestData) {
            this.vars = {
                ...this.vars,
                ...ingestData.vars
            };
        }

        let v = this.content.match(varOutputRegex);
        if (v !== null) {
            this.content = this.content.replace(v[0], v[1]);
            this.setVar(v[2], null);
            this.outputs.push(v[2]);
        }

        let pipes = this.content.match(pipedCommandRegex);
        if (pipes !== null) {
            this.content = pipes[1];
            this.pipedCommand = pipes[2];
        }

        if (this.content.split(' ').length > 1)
            this.build(this.content);
    }
}

module.exports = MessageData;