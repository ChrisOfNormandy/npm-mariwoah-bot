"use strict";
class Command {
    /**
     *
     * @returns
     */
    getGroup() {
        return this.group;
    }
    /**
     *
     * @returns
     */
    getRegex() {
        return this.regex;
    }
    /**
     *
     * @param {RegExp} command
     * @param {RegExp} args
     * @param {number[]} indexes
     * @param {boolean} optional
     * @returns
     */
    setRegex(command, args = null, indexes = [], optional = false) {
        this.regex = {
            command: command,
            arguments: args,
            argumentIndexes: indexes,
            argsOptional: optional
        };
        this.description = {
            command: '',
            arguments: [],
            flags: []
        };
        return this;
    }
    /**
     *
     * @returns
     */
    getDescription() {
        return this.description;
    }
    /**
     *
     * @param {string} desc
     * @returns
     */
    setCommandDescription(desc) {
        this.description.command = desc;
        return this;
    }
    /**
     *
     * @param {number} index
     * @param {string} name
     * @param {string} desc
     * @param {boolean} optional
     * @returns
     */
    setArgumentDescription(index, name, desc, optional = false) {
        this.description.arguments[index] = {
            _: name,
            d: desc,
            optional
        };
        return this;
    }
    /**
     *
     * @param {number} index
     * @param {string} name
     * @param {string} desc
     * @param {boolean} optional
     * @returns
     */
    setFlagDescription(index, name, desc, optional = true) {
        this.description.flags[index] = {
            _: name,
            d: desc,
            optional
        };
        return this;
    }
    /**
     *
     * @param {import('./MessageData')} data
     * @returns
     */
    run(data) {
        return this.func(data);
    }
    /**
     *
     * @param {string} key
     * @param {*} value
     * @returns
     */
    setSetting(key, value) {
        this.settings.set(key, value);
        return this;
    }
    /**
     *
     * @param {string} key
     * @returns
     */
    getSetting(key) {
        return this.settings.get(key);
    }
    /**
     *
     * @returns
     */
    disable() {
        this.enabled = false;
        return this;
    }
    /**
     *
     * @returns
     */
    setAdminOnly() {
        this.adminOnly = true;
        return this;
    }
    /**
     *
     * @param  {Command} command
     * @returns
     */
    addSubcommand(name, command) {
        this.subcommands.set(name, command.setName(name));
        return this;
    }
    /**
     *
     * @param {string} name
     * @returns
     */
    getSubcommand(name) {
        return this.subcommands.get(name);
    }
    /**
     *
     * @param {string} name
     * @returns
     */
    setName(name) {
        this.name = name;
        return this;
    }
    /**
     *
     * @param {function(MessageData):Promise<import('./Output')>} func
     * @returns
     */
    setFunction(func) {
        this.func = func;
        return this;
    }
    /**
     *
     * @param {string} flag
     * @param {string} value
     * @returns
     */
    setFlag(flag, value) {
        this.flags.set(flag, value);
        return this;
    }
    /**
     *
     * @param {string} flag
     * @returns
     */
    getFlag(flag) {
        return this.flags.get(flag);
    }
    /**
     *
     * @param {string} group
     * @param {string} name
     * @param {function(import('./MessageData'))} func
     */
    constructor(group = undefined, name = undefined, func = () => { }) {
        /**
         * @type {string}
         */
        this.group = group;
        /**
         * @type {string}
         */
        this.name = name;
        /**
         * @type {function(import('./MessageData')):Promise<import('./Output')>}
         */
        this.func = func;
        this.regex = {
            /**
             * @type {RegExp}
             */
            command: undefined,
            /**
             * @type {RegExp}
             */
            arguments: undefined,
            /**
             * @type {number[]}
             */
            argumentIndexes: undefined,
            /**
             * @type {boolean}
             */
            argsOptional: undefined
        };
        this.description = {
            /**
             * @type {string}
             */
            command: undefined,
            /**
             * @type {string[]}
             */
            arguments: undefined,
            /**
             * @type {string[]}
             */
            flags: undefined
        };
        /**
         * @type {Map<string, Command>}
         */
        this.subcommands = new Map();
        this.adminOnly = false;
        this.enabled = true;
        /**
         * @type {Map<string, *>}
         */
        this.settings = new Map();
        /**
         * @type {Map<string, *>}
         */
        this.flags = new Map();
    }
}
module.exports = Command;
