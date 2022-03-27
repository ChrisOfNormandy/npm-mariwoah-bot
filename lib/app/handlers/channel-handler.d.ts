export namespace voiceChannel {
    /**
     *
     * @param {Discord.Message} message
     * @returns
     */
    function get(message: Discord.Message<boolean>): Discord.VoiceBasedChannel | null;
    /**
     *
     * @param {Discord.Message} message
     * @returns
     */
    function get(message: Discord.Message<boolean>): Discord.VoiceBasedChannel | null;
    /**
     *
     * @param {Discord.Message} message
     * @returns
     */
    function connection(message: Discord.Message<boolean>): import("@discordjs/voice").VoiceConnection | undefined;
    /**
     *
     * @param {Discord.Message} message
     * @returns
     */
    function connection(message: Discord.Message<boolean>): import("@discordjs/voice").VoiceConnection | undefined;
    /**
     *
     * @param {Discord.Message} message
     * @param {string} channelId
     * @returns
     */
    function join(message: Discord.Message<boolean>, channelId: string): import("@discordjs/voice").VoiceConnection;
    /**
     *
     * @param {Discord.Message} message
     * @param {string} channelId
     * @returns
     */
    function join(message: Discord.Message<boolean>, channelId: string): import("@discordjs/voice").VoiceConnection;
    /**
     *
     * @param {Discord.Message} message
     */
    function leave(message: Discord.Message<boolean>): void;
    /**
     *
     * @param {Discord.Message} message
     */
    function leave(message: Discord.Message<boolean>): void;
}
export namespace audioPlayer {
    function create(): import("@discordjs/voice").AudioPlayer;
    function create(): import("@discordjs/voice").AudioPlayer;
    /**
     *
     * @param {AudioPlayer} player
     * @param  {...VoiceConnection} connections
     */
    function connect(player: AudioPlayer, ...connections: VoiceConnection[]): void;
    /**
     *
     * @param {AudioPlayer} player
     * @param  {...VoiceConnection} connections
     */
    function connect(player: AudioPlayer, ...connections: VoiceConnection[]): void;
    /**
     *
     * @param {internal.Readable} stream
     * @returns
     */
    function createResource(stream: internal.Readable): import("@discordjs/voice").AudioResource<any>;
    /**
     *
     * @param {internal.Readable} stream
     * @returns
     */
    function createResource(stream: internal.Readable): import("@discordjs/voice").AudioResource<any>;
}
import Discord = require("discord.js");
