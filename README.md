# Mariwoah Bot - The NPM Module

## Installation

> yarn add @chrisofnormandy/mariwoah-bot

## What's Included

- A basic Discord `Bot` framework.
- `Command` parser with mention, url and flag support.
- An easy-to-use command generator and subcommand handler.
- Command grouping - `CommandGroup`.
- `Discord` and `DiscordVoice` package handling (allowing easy voice channel usage).
- Builder for `MessageEmbed`, since discord.js keeps pushing breaking changes requiring hefty rewrites.

And what's supported by the bot:
- Message content parsing using Regular Expressions (RegExp) for commands, arguments.
- Message content handling using `MessageData` to pass to command functions.
- Asynchronous handling - all commands handled using `Promise`.
- Standard response (including errors) handling using `Promise<Output>`.
- Built-in `help` command.
    - Will display all available commands and "man pages" for each command.
- Built-in `say` ("announcement") and `print` ("say phrase as bot") commands.
- Assign command outputs to "variables" and "pipe" them to other commands.
    - Ex: `~roll` outputs a number 1-10.
    - `~roll > rolled | ~say I rolled a {rolled}!` = roll number 1-10 and make an "announcement" saying `I rolled a <number>!` like `I rolled a 5!`

## Setup
The following is a step-by-step process for setting up a basic "starter bot."

If you're not new to Node projects, skip steps 1 and 2.

1. Within the directory your bot will be hosted, open a terminal.
2. Run the following commands - this will initialize a Node project.
    - `npm init`
    - Alternatively, create a `package.json` file (example provided in the snipits below).

3. Create the following in the directory your bot will be hosted from:
    - `config/` - A folder named `config`.
    - `config/config.json` - A file named `config.json`. *(Optional - just a method of storing constants)*
    - `bot.js` - The entry point for your bot application. Alternatively `index.js` or whatever you would like to name it. It should match the `main` property in `package.json`.

4. Copy the example data from the snipits below to the respective new files.

That's it! If you start your bot (`node bot.js`) and add it to a Discord server, you should have access to all default commands provided by the package (see available features).

## Creating Commands
Setting up a command is done via the `Command` class.
Here is an example command that rolls a random number from 1 to a provided value, a number or provided times. This requires two arguments.

```js
function rollFunction(data) {
    const args = data.arguments;

    const count = args[0],
    sides = args[1] || 6;

    const rolls = [];
    for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(1 + Math.random() * sides));
    }

    return new Output(rolls.join(', ')).setValues(rolls).resolve();
}

const songInfo = new Command(
        'utility',
        'roll-dice',
        rollFunction
    )
        .setRegex(/(roll)/, /\s(\d+)?(\s(\d+))?/, [1, 3])
        .setCommandDescription('Rolls a number between 1 and a given value.')
        .setArgumentDescription(0, 'Sides', 'Some number.')
        .setArgumentDescription(1, 'Count', 'Some number.', true)
```

Of course, this function is very basic and doesn't account for invalid arguments. However, this should help provide some basics for command creation and function handling.

### Return Object

All command functions should return an `Output` object asynchronously. This can be done using:

`return Promise.resolve(new Output())` or

`return new Output().resolve()` or even

`return new Promise((resolve) => new Output().resolve(resolve))`.

If you need to reject / handle an exception (error), you may do so in a similar fashion:

`return Promise.reject(new Output().makeError('Some error happened.'))` or

`return new Output().setError(err).reject()` or even

`return new Promise((resolve, reject) => new Output().setError(err).reject(reject))`.

Notice, to define the error to reject, use `.setError(Error)`. To create a new error, you can use `.makeError(string)`, which is the same as `.setError(new Error(message))`.

For both `Output.resolve` and `Output.reject`, supplying a function to either will run those functions, and will always return a `Promise` (resolve or reject respectively).

### Add Commands to Bot

To add this new command to the bot, define an object that groups all functions as a key (`string`) and property (`Command[]`) like `{general: [...Commands]}`.

This object should be used as the argument in `Bot.addCommands(Object.<string, Command[]>)` on creation.

# Snipits

## `config.json`
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

## `bot.js`
```js
const { Bot, Discord } = require('@chrisofnormandy/mariwoah-bot');
const config; // Import from somewhere or define here using the format above.
// const config = require('./config/config.json');

const onStartup = () => console.log('Ready!');

const bot = new Bot(config)
    .allow(
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildEmojisAndStickers,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildMembers
        // ^ Intents here can be added or removed as seen fit.
        // By default, the following are used:
        /*
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessages
        */
       // ... and are not required again here.
    );
    //.addCommands({group: [...Commands]});

bot
    .startup(startupConfig)
    .then((bot) => bot.setStatus('%guild_count% servers | %prefix%?'))
    .catch(console.error)
    .then(onStartup);
```