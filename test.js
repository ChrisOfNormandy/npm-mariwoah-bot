const { Bot, Discord } = require('./src/index');
require('dotenv').config();

const config = {
    'settings': {
        'commands': {
            'prefix': '~'
        },
        'dev': {
            'enabled': false
        },
        'logging': {
            'enabled': true,
            'channels': [
                {
                    'guild': process.env.GUILD_ID,
                    'channel': process.env.CHANNEL_ID,
                    'options': {
                        'onStart': true
                    }
                }
            ]
        }
    },
    'auth': {
        'token': process.env.CLIENT_TOKEN
    }
};

const startupConfig = {
    devEnabled: true
};

const onStartup = () => console.log('Ready!');

const bot = new Bot(config)
    .allow(
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildEmojisAndStickers,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildMembers
    );

bot
    .startup(startupConfig)
    .then((bot) => bot.setStatus('%guild_count% servers | %prefix%?'))
    .catch(console.error)
    .then(onStartup);