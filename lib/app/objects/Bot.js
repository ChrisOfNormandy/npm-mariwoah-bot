"use strict";
const parse = require('../parser/parse');
const groups = require('../groups');
const { GatewayIntentBits, Client, ActivityType } = require('discord.js');
const { getTimestamp } = require('../handlers').time;
const { logging } = require('../logging/logging');
const { database } = require('../handlers');
const { generateDependencyReport } = require('@discordjs/voice');
const { createConfig, loadConfig } = require('./Config');
class Bot {
    _formatStr(str) {
        return str
            .replace(/%prefix%/g, this.prefix.replace(/\\/g, ''))
            .replace(/%channel_count%/g, this.client.channels.cache.size)
            .replace(/%guild_count%/g, this.client.guilds.cache.size);
    }
    setClient(token) {
        if (!token)
            return Promise.reject(new Error('No auth token.'));
        this.client = new Client({ intents: this.intents });
        return this.client.login(token);
    }
    /**
     *
     * @param {Intents[]} intents
     * @param {{devEnabled: boolean}} options
     * @returns {Promise<Bot>}
     */
    startup({ devEnabled = false, databaseTables = null, resetDatabase = false } = {}) {
        /**
         *
         * @returns {Promise<boolean>} Status of database connection. If no database or invalid, will be `false`.
         */
        const onLogin = () => {
            /**
             *
             * @param {import('discord.js').Message} message
             */
            const onMessage = (message) => {
                if (!message.author.bot) {
                    let start = Date.now();
                    parse(this, message, { devEnabled })
                        .then((response) => {
                        let end = Date.now();
                        if (this.config.settings.dev.enabled) {
                            console.log(getTimestamp(start, end));
                            console.log(response);
                        }
                        if (this.config.settings.logging.enabled) {
                            this.config.settings.logging.channels.forEach((log) => {
                                this.client.guilds.fetch(log.guild)
                                    .then((guild) => {
                                    if (log.options.onStart)
                                        guild.channels.cache
                                            .get(log.channel)
                                            .send('This bot has been configured to output logging notifications to this channel.\nThis is a startup notice.');
                                })
                                    .catch((err) => console.error('Failed to fetch guild.', err));
                            });
                        }
                    })
                        .catch((err) => {
                        if (err !== null)
                            logging.error(err, message.content);
                    });
                }
            };
            return new Promise((resolve, reject) => {
                const f = (dbStatus) => {
                    if (dbStatus)
                        console.log('Connected to database.');
                    console.log('Setting event handlers...');
                    /**
                     *
                     * @param {Client} client
                     */
                    const onReady = (client) => {
                        console.log('Ready!');
                        console.log(this._formatStr(this.startupMessage));
                        if (this.config.settings.logging.enabled) {
                            const printToChannel = (log) => {
                                client.guilds.fetch(log.guild)
                                    .then((guild) => {
                                    if (log.options.onStart)
                                        guild.channels.cache
                                            .get(log.channel)
                                            .send('This bot has been configured to output logging notifications to this channel.\nThis is a startup notice.');
                                })
                                    .catch((err) => console.error('Failed to fetch guild.', err));
                            };
                            this.config.settings.logging.channels.forEach(printToChannel);
                            resolve(this);
                        }
                        else
                            resolve(this);
                    };
                    this.client.on('ready', onReady);
                    this.client.on('error', (err) => {
                        console.error(err);
                        reject(err);
                    });
                    this.client.on('messageCreate', onMessage);
                };
                if (this.config.settings.database && this.config.settings.database.enabled) {
                    console.log('Logging in to database...');
                    this.connection = database.login(this.config.settings.database);
                    if (databaseTables) {
                        database.preloadTables(databaseTables, !!resetDatabase)
                            .then(f)
                            .catch(reject);
                    }
                }
                else
                    f(false);
            });
        };
        return new Promise((resolve, reject) => {
            this.setClient(this.config.auth.token)
                .then(() => {
                console.log('Created client.');
                onLogin()
                    .then((dbStatus) => {
                    console.log('Connected:', dbStatus);
                    resolve(this);
                })
                    .catch(reject);
            })
                .catch(reject);
        });
    }
    /**
     *
     * @param {string} str
     * @param {ActivityType} statusType
     * @returns
     */
    setStatus(str, statusType = ActivityType.Watching) {
        this.status = str;
        this.statusType = statusType;
        if (this.client)
            this.client.user.setActivity(this._formatStr(this.status), { type: this.statusType });
        else
            console.error(new Error('No client?'));
        return this;
    }
    /**
     *
     * @param {import('./Config').BotConfig} config
     * @returns
     */
    fromConfig(config) {
        this.config = loadConfig(config);
        if (this.config.settings.dev.enabled)
            console.log(generateDependencyReport());
        this.startupMessage = this.config.settings.logging.startupMessage || '';
        return this.setPrefix(this.config.settings.commands.prefix);
    }
    /**
     *
     * @param  {...import('discord.js').GatewayIntentBits} intents
     */
    allow(...intents) {
        this.intents = [...new Set([...this.intents, ...intents])];
        return this;
    }
    /**
     *
     * @param {string} prefix
     * @returns
     */
    setPrefix(prefix = '~') {
        this.prefix = prefix;
        console.log('Prefix:', this.prefix);
        return this;
    }
    /**
     *
     * @param {Object.<string, import('./Command')>} commands
     * @returns
     */
    addCommands(commands) {
        let i = 0;
        for (let group in commands) {
            commands[group].forEach((command) => groups.addCommandGroup(group).addCommand(command));
            i++;
        }
        console.log('Loaded', Object.keys(commands).length, 'groups and', i, 'commands.');
        return this;
    }
    /**
     *
     * @param {import('./Config').BotConfig} config
     * @param {import('discord.js').GatewayIntentBits[]} intents
     * @param {Object.<string, import('./Command')>} commands
     */
    constructor(config) {
        this.prefix = '';
        /**
         * @type {import('./Config').BotConfig}
         */
        this.config;
        /**
         * @type {Client}
         */
        this.client = null;
        /**
         * @type {import('pg').Pool}
         */
        this.databaseConnection = null;
        /**
         * @type {import('discord.js').GatewayIntentBits[]}
         */
        this.intents = [];
        /**
         * @type {ActivityType}
         */
        this.statusType = ActivityType.Watching;
        this.status = '';
        if (config)
            this.fromConfig(config);
        else
            this.fromConfig(createConfig());
        this.setStatus('chat. | %prefix%? | %prefix%help')
            .allow(GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages);
    }
}
module.exports = Bot;
