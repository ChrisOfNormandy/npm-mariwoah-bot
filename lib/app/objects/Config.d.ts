export type BotConfig = {
    settings: {
        commands: {
            prefix: string;
        };
        dev: {
            enabled: boolean;
        };
        logging: {
            enabled: boolean;
            startupMessage: string;
            channels: never[];
        };
        database: {
            enabled: boolean;
            user: string;
            password: string;
            database: string;
            host: string;
        };
    };
    auth: {
        token: string;
    };
};
/**
 *
 * @returns .
 */
export function createConfig(): any;
/**
 *
 * @param {*} cfg
 * @returns
 */
export function loadConfig(cfg: any): any;
