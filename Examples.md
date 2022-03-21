# `config.json`
```json
{
    "settings": {
        "commands": {
            "prefix": "~"
        },
        "dev": {
            "enabled": true
        },
        "logging": {
            "enabled": true,
            "channels": [
                {
                    "guild": "012345678912345678",
                    "channel": "012345678912345678",
                    "options": {
                        "onStart": true
                    }
                }
            ]
        }
    },
    "auth": {
        "token": "<Your Discord bot token>",
    }
}
```

# `bot.js`
```js
const { Intents } = require('discord.js');
const { Bot } = require('@chrisofnormandy/mariwoah-bot');
const config; // Import from somewhere or define here.

const bot = new Bot(config, [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES], {});

bot.startup({ devEnabled: true })
    .then(({bot}) => {
        // Do something with the logged in Client instance.
    })
    .catch((err) => console.error(err));
```