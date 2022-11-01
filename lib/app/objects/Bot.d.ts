export = Bot;
declare class Bot {
    /**
     *
     * @param {import('./Config').BotConfig} config
     * @param {import('discord.js').GatewayIntentBits[]} intents
     * @param {Object.<string, import('./Command')>} commands
     */
    constructor(config: import('./Config').BotConfig);
    _formatStr(str: any): any;
    setClient(token: any): Promise<string>;
    client: Client;
    /**
     *
     * @param {Intents[]} intents
     * @param {{devEnabled: boolean}} options
     * @returns {Promise<Bot>}
     */
    startup({ devEnabled, databaseTables, resetDatabase }?: Intents[]): Promise<Bot>;
    connection: any;
    /**
     *
     * @param {string} str
     * @param {ActivityType} statusType
     * @returns
     */
    setStatus(str: string, statusType?: ActivityType, suppressError?: boolean): Bot;
    status: string;
    statusType: ActivityType;
    /**
     *
     * @param {import('./Config').BotConfig} config
     * @returns
     */
    fromConfig(config: import('./Config').BotConfig): Bot;
    config: import('./Config').BotConfig;
    startupMessage: string | undefined;
    /**
     *
     * @param  {...import('discord.js').GatewayIntentBits} intents
     */
    allow(...intents: import('discord.js').GatewayIntentBits[]): Bot;
    intents: import('discord.js').GatewayIntentBits[];
    /**
     *
     * @param {string} prefix
     * @returns
     */
    setPrefix(prefix?: string): Bot;
    prefix: string;
    /**
     *
     * @param {Object.<string, import('./Command')>} commands
     * @returns
     */
    addCommands(commands: {
        [x: string]: import('./Command');
    }): Bot;
    /**
     * @type {import('pg').Pool}
     */
    databaseConnection: any;
}
import { Client } from "discord.js";
import { ActivityType } from "discord-api-types/payloads/v10/gateway";
