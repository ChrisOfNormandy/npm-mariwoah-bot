export = Command;
declare class Command {
    /**
     *
     * @param {string} group
     * @param {string} name
     * @param {function(import('./MessageData'))} func
     */
    constructor(group?: string, name?: string, func?: (arg0: import('./MessageData')) => any);
    /**
     *
     * @returns
     */
    getGroup(): string;
    /**
     *
     * @returns
     */
    getRegex(): {
        /**
         * @type {RegExp}
         */
        command: RegExp;
        /**
         * @type {RegExp}
         */
        arguments: RegExp;
        /**
         * @type {number[]}
         */
        argumentIndexes: number[];
        /**
         * @type {boolean}
         */
        argsOptional: boolean;
    };
    /**
     *
     * @param {RegExp} command
     * @param {RegExp} args
     * @param {number[]} indexes
     * @param {boolean} optional
     * @returns
     */
    setRegex(command: RegExp, args?: RegExp, indexes?: number[], optional?: boolean): Command;
    regex: {
        /**
         * @type {RegExp}
         */
        command: RegExp;
        /**
         * @type {RegExp}
         */
        arguments: RegExp;
        /**
         * @type {number[]}
         */
        argumentIndexes: number[];
        /**
         * @type {boolean}
         */
        argsOptional: boolean;
    };
    description: {
        /**
         * @type {string}
         */
        command: string;
        /**
         * @type {string[]}
         */
        arguments: string[];
        /**
         * @type {string[]}
         */
        flags: string[];
    };
    /**
     *
     * @returns
     */
    getDescription(): {
        /**
         * @type {string}
         */
        command: string;
        /**
         * @type {string[]}
         */
        arguments: string[];
        /**
         * @type {string[]}
         */
        flags: string[];
    };
    /**
     *
     * @param {string} desc
     * @returns
     */
    setCommandDescription(desc: string): Command;
    /**
     *
     * @param {number} index
     * @param {string} name
     * @param {string} desc
     * @param {boolean} optional
     * @returns
     */
    setArgumentDescription(index: number, name: string, desc: string, optional?: boolean): Command;
    /**
     *
     * @param {number} index
     * @param {string} name
     * @param {string} desc
     * @param {boolean} optional
     * @returns
     */
    setFlagDescription(index: number, name: string, desc: string, optional?: boolean): Command;
    /**
     *
     * @param {import('./MessageData')} data
     * @returns
     */
    run(data: import('./MessageData')): Promise<import("./Output")>;
    /**
     *
     * @param {string} key
     * @param {*} value
     * @returns
     */
    setSetting(key: string, value: any): Command;
    /**
     *
     * @param {string} key
     * @returns
     */
    getSetting(key: string): any;
    /**
     *
     * @returns
     */
    disable(): Command;
    enabled: boolean;
    /**
     *
     * @returns
     */
    setAdminOnly(): Command;
    adminOnly: boolean;
    /**
     *
     * @param  {Command} command
     * @returns
     */
    addSubcommand(name: any, command: Command): Command;
    /**
     *
     * @param {string} name
     * @returns
     */
    getSubcommand(name: string): Command | undefined;
    /**
     *
     * @param {string} name
     * @returns
     */
    setName(name: string): Command;
    name: string;
    /**
     *
     * @param {function(MessageData):Promise<import('./Output')>} func
     * @returns
     */
    setFunction(func: (arg0: MessageData) => Promise<import('./Output')>): Command;
    func: (arg0: import('./MessageData')) => Promise<import('./Output')>;
    /**
     *
     * @param {string} flag
     * @param {string} value
     * @returns
     */
    setFlag(flag: string, value: string): Command;
    /**
     *
     * @param {string} flag
     * @returns
     */
    getFlag(flag: string): any;
    /**
     * @type {string}
     */
    group: string;
    /**
     * @type {Map<string, Command>}
     */
    subcommands: Map<string, Command>;
    /**
     * @type {Map<string, *>}
     */
    settings: Map<string, any>;
    /**
     * @type {Map<string, *>}
     */
    flags: Map<string, any>;
}
