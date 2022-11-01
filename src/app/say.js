const { chat, embed } = require('./handlers');
const Output = require('./objects/Output');

const { colors } = chat;
const { MessageEmbed } = embed;

/**
 *
 * @param {import('./objects/MessageData')} data
 * @returns
 */
function say(data) {
    const embed = new MessageEmbed()
        .setTitle('Announcement')
        .setColor(colors.byName.white)
        .makeField(data.message.member.nickname || data.message.author.username, data.arguments[0]);

    return new Output()
        .addEmbed(embed)
        .setValues(data.arguments[0])
        .resolve();
}

module.exports = say;