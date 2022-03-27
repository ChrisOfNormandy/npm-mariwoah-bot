"use strict";
// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, NoSubscriberBehavior, createAudioResource } = require('@discordjs/voice');
const voiceChannel = {
    /**
     *
     * @param {Discord.Message} message
     * @returns
     */
    get(message) {
        return message.member.voice.channel;
    },
    /**
     *
     * @param {Discord.Message} message
     * @returns
     */
    connection(message) {
        return getVoiceConnection(message.guild.id);
    },
    /**
     *
     * @param {Discord.Message} message
     * @param {string} channelId
     * @returns
     */
    join(message, channelId) {
        return joinVoiceChannel({
            channelId,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });
    },
    /**
     *
     * @param {Discord.Message} message
     */
    leave(message) {
        let con = this.connection(message);
        if (con)
            con.destroy();
    }
};
const audioPlayer = {
    create() {
        return createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause
            }
        });
    },
    /**
     *
     * @param {AudioPlayer} player
     * @param  {...VoiceConnection} connections
     */
    connect(player, ...connections) {
        connections.forEach((con) => con.subscribe(player));
    },
    /**
     *
     * @param {internal.Readable} stream
     * @returns
     */
    createResource(stream) {
        const audio = createAudioResource(stream, { inlineVolume: true });
        audio.volume.setVolume(1);
        return audio;
    }
};
module.exports = {
    voiceChannel,
    audioPlayer
};
