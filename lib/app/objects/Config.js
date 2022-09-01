"use strict";
const _ = require('lodash');
const config = {
    settings: {
        commands: {
            prefix: '~'
        },
        dev: {
            enabled: false
        },
        logging: {
            enabled: false,
            startupMessage: 'Bot has started in %channel_count% channels of %guild_count% guilds.',
            channels: []
        },
        database: {
            enabled: false,
            user: '',
            password: '',
            database: '',
            host: 'localhost'
        }
    },
    auth: {
        token: ''
    }
};
/**
 *
 * @returns .
 */
function createConfig() {
    return _.clone(config);
}
/**
 *
 * @param {*} cfg
 * @returns
 */
function loadConfig(cfg) {
    return _.merge(createConfig(), cfg);
}
module.exports = {
    createConfig,
    loadConfig
};
/**
 * @typedef {config} BotConfig
 */ 
