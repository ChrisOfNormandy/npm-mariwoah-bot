const Discord = require('discord.js');
const DiscordVoice = require('@discordjs/voice');

const groups = require('./app/groups');
const handlers = require('./app/handlers');
const objects = require('./app/objects');

module.exports = {
    Discord,
    DiscordVoice,

    groups,
    handlers,

    ...objects
};