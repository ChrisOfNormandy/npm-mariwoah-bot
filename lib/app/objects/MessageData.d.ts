export = MessageData;
declare class MessageData {
    /**
     *
     * @param {import('./Bot')} bot
     * @param {string} content
     * @param {import('discord.js').GuildMember} member
     * @param {import('./Output')} ingest
     * @param {import('./MessageData')} ingestData
     */
    constructor(bot: import('./Bot'), content: string, member: import('discord.js').GuildMember, ingest?: import('./Output'), ingestData?: import('./MessageData'));
    /**
     *
     * @param {string} content
     */
    build(content: string): void;
    content: string;
    /**
     *
     * @param  {...string} args
     */
    setArguments(...args: string[]): void;
    arguments: any[];
    /**
     *
     * @param {string} cmd
     */
    setCommand(cmd: string): void;
    command: string | null;
    /**
     *
     * @param {string} sCmd
     */
    setSubcommand(sCmd: string): void;
    subcommand: string | null;
    /**
     *
     * @param {string} content
     */
    setContent(content: string): void;
    bot: import("./Bot");
    variables: any[];
    mentions: any[];
    roles: any[];
    urls: any[];
    flags: Map<any, any>;
    vars: Map<any, any>;
    outputs: string[];
    admin: boolean;
    hasData: boolean;
    ingest: import("./Output");
    pipedCommand: string | null;
}
