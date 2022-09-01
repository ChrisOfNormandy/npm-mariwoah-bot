export = Output;
declare class Output {
    /**
     *
     * @param  {...any} content
     */
    constructor(...content: any[]);
    /**
     *
     * @param  {...any} values
     * @returns
     */
    setValues(...values: any[]): Output;
    values: any[];
    /**
     *
     * @param {Error} error
     * @returns
     */
    setError(error: Error): Output;
    error: Error;
    /**
     *
     * @returns
     */
    getErrors(): Error;
    /**
     *
     * @returns
     */
    getContent(): {
        content: string;
        embeds: import("discord.js").APIEmbed[];
        files: any[];
    };
    /**
     *
     * @param {string} key
     * @param {*} value
     * @returns
     */
    setOption(key: string, value: any): Output;
    /**
     *
     * @param {string} key
     * @returns
     */
    getOption(key: string): any;
    /**
     *
     * @param  {...import("../handlers/embed-handler").MessageEmbed} embeds
     * @returns
     */
    addEmbed(...embeds: import("../handlers/embed-handler").MessageEmbed[]): Output;
    embeds: import("discord.js").APIEmbed[];
    addFile(...files: any[]): Output;
    files: any[];
    resolve(): Promise<Output>;
    reject(): Promise<never>;
    /**
     *
     * @param {function(*):void} fn `Promise.resolve` or `Promise.reject`
     * @returns
     */
    handleAsync(fn: (arg0: any) => void): void;
    /**
     *
     * @param {Error} err
     * @param {function(*):void} reject
     * @returns
     */
    handleCatch(err: Error, reject: (arg0: any) => void): void;
    content: any[];
    /**
     * @type {Map<string, *>}
     */
    options: Map<string, any>;
}
