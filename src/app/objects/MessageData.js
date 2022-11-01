const urlRegex = /(https?:\/\/)?(\w+\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;

const flagRegex = /\s-[a-zA-Z]+\b/g;

const userMentionsRegex = /<@!\d{18}>/g;
const roleMentionsRegex = /<@&\d{18}>/g;

const variableRegex = /\{\w+(\[[-\d\w.]+\])?\}/g;
const variableRegex_ = /\{(\w+)(\[([-\d\w.]+)\])?\}/;

const varOutputRegex = /(.+?)\s?>\s?(\w+)/;
const pipedCommandRegex = /(.+?)\s?\|\s?(.+)/;

/**
 *
 * @param {*} value
 * @returns
 */
function formatVar(value) {
    if (Array.isArray(value)) {
        const valueTypes = [...new Set(value.map((v) => typeof v))];

        return `Array<${valueTypes.join('|')}>`;
    }

    switch (typeof value) {
        case 'object': {
            const keys = Object.keys(value);

            const keyTypes = [...new Set(keys.map((v) => typeof v))];
            const valueTypes = [...new Set(Object.values(value).map((v) => typeof v))];

            return `Object<${keyTypes.join('|')}, ${valueTypes.join('|')}>{${keys.join(', ')}}`;
        }
        default: return value;
    }
}

class MessageData {
    handleVars(content, str_) {
        let str = str_;

        const variables = content.match(variableRegex);

        if (variables !== null) {
            for (let v in variables) {
                const m = variables[v].match(variableRegex_);

                let val = m[1];
                this.variables.push(val);

                let p = this.getVar(val);

                if (m[3]) {
                    const vars = m[3].split('.');
                    let pointer = vars.shift();

                    while (pointer !== undefined && p[pointer] !== undefined) {
                        p = p[pointer];

                        pointer = vars.shift();
                    }
                }

                if (this.checkVarNot(val, null))
                    str = str_.replace(variables[v], formatVar(p));
            }
        }

        console.log('handled:', content, str);

        return { content, str };
    }

    /**
     *
     * @param {string} content
     */
    build(contentIn) {
        let { str } = this.handleVars(contentIn, contentIn);
        let content = str;

        let mentions = content.match(userMentionsRegex);
        if (mentions !== null) {
            for (let m in mentions) {
                this.mentions.push(mentions[m].match(/\d{18}/)[0]);
                str = str.replace(mentions[m], `<USER:${m}>`);
            }
        }

        console.log(this.mentions);

        let roles = content.match(roleMentionsRegex);
        if (roles !== null) {
            for (let m in roles) {
                this.roles.push(roles[m].match(/\d{18}/)[0]);
                str = str.replace(roles[m], `<ROLE:${m}>`);
            }
        }

        console.log(this.roles);

        const urls = content.match(urlRegex);
        if (urls !== null) {
            for (let url in urls) {
                this.urls.push(urls[url]);
                str = str.replace(urls[url], `<URL:${url}>`);
            }
        }

        console.log(this.urls);

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

        console.log(this.flags);

        this.content = this.handleVars(content, str).str;

        console.log(this.content);
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
     * @param {import('discord.js').Message} message
     * @param {import('./Output')} ingest
     * @param {import('./MessageData')} ingestData
     */
    constructor(bot, content, message, ingest = undefined, ingestData = undefined) {
        this.bot = bot;

        console.log('Got:', content);

        this.content = content;
        this.message = message;
        const member = message.member;

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

// Example: ~say ~ping ? ~say Yes : ~shuffle a,b,c > x | ~say {x}