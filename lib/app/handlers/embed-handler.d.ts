export class MessageEmbed {
    /**
     *
     * @param {import('discord.js').APIEmbed} data
     */
    constructor(data: import('discord.js').APIEmbed);
    /**
     *
     * @param {import('discord.js').APIEmbedAuthor} author
     * @returns
     */
    setAuthor(author: import('discord.js').APIEmbedAuthor): MessageEmbed;
    /**
     *
     * @param {string} name
     * @param  {...any} args See `createAuthor(...)`
     * @returns
     */
    makeAuthor(name: string, ...args: any[]): MessageEmbed;
    /**
     *
     * @param {number | string} color Decimal color value; will convert hex colors to decimal.
     * @returns
     */
    setColor(color: number | string): MessageEmbed;
    /**
     *
     * @param {string} description
     * @returns
     */
    setDescription(description: string): MessageEmbed;
    /**
     *
     * @param  {...import('discord.js').APIEmbedField} fields
     * @returns
     */
    addField(...fields: import('discord.js').APIEmbedField[]): MessageEmbed;
    /**
     *
     * @param {string} name
     * @param {*} value
     * @param  {...any} args See `createField(...)`
     * @returns
     */
    makeField(name: string, value: any, ...args: any[]): MessageEmbed;
    /**
     *
     * @param {import('discord.js').APIEmbedFooter} footer
     * @returns
     */
    setFooter(footer: import('discord.js').APIEmbedFooter): MessageEmbed;
    /**
     *
     * @param {string} text
     * @param  {...any} args See `createFooter(...)`
     * @returns
     */
    makeFooter(text: string, ...args: any[]): MessageEmbed;
    /**
     *
     * @param {import('discord.js').APIEmbedImage} image
     * @returns
     */
    setImage(image: import('discord.js').APIEmbedImage): MessageEmbed;
    /**
     *
     * @param {string} url
     * @param  {...any} args See `createImage(...)`
     * @returns
     */
    makeImage(url: string, ...args: any[]): MessageEmbed;
    /**
     *
     * @param {import('discord.js').APIEmbedProvider} provider
     * @returns
     */
    setProvider(provider: import('discord.js').APIEmbedProvider): MessageEmbed;
    /**
     *
     * @param {string} name
     * @param  {...any} args See `createProvider(...)`
     * @returns
     */
    makeProvider(name: string, ...args: any[]): MessageEmbed;
    /**
     *
     * @param {import('discord.js').APIEmbedThumbnail} thumbnail
     * @returns
     */
    setThumbnail(thumbnail: import('discord.js').APIEmbedThumbnail): MessageEmbed;
    /**
     *
     * @param {string} url
     * @param  {...any} args See `createThumbnail(...)`
     * @returns
     */
    makeThumbnail(url: string, ...args: any[]): MessageEmbed;
    /**
     *
     * @param {string} timestamp
     * @returns
     */
    setTimestamp(timestamp: string): MessageEmbed;
    /**
     *
     * @param {string} title
     * @returns
     */
    setTitle(title: string): MessageEmbed;
    /**
     *
     * @param {string} url
     * @returns
     */
    setURL(url: string): MessageEmbed;
    /**
     *
     * @param {import('discord.js').APIEmbedVideo} video
     * @returns
     */
    setVideo(video: import('discord.js').APIEmbedVideo): MessageEmbed;
    /**
     *
     * @param {string} url
     * @param  {...any} args See `createVideo(...)`
     * @returns
     */
    makeVideo(url: string, ...args: any[]): MessageEmbed;
    /**
     *
     * @returns
     */
    build(): import("discord.js").APIEmbed;
    /**
     * @type {import("discord.js").APIEmbed}
     */
    data: import("discord.js").APIEmbed;
}
export function createAuthor(name: any, icon_url?: undefined, proxy_icon_url?: undefined, url?: undefined): {
    icon_url: undefined;
    name: any;
    proxy_icon_url: undefined;
    url: undefined;
};
export function createField(name: any, value: any, inline?: boolean): {
    name: any;
    value: any;
    inline: boolean;
};
export function createFooter(text: any, icon_url?: undefined, proxy_icon_url?: undefined): {
    text: any;
    icon_url: undefined;
    proxy_icon_url: undefined;
};
export function createImage(url: any, width?: undefined, height?: undefined, proxy_url?: undefined): {
    url: any;
    width: undefined;
    height: undefined;
    proxy_url: undefined;
};
export function createProvider(name: any, url?: undefined): {
    name: any;
    url: undefined;
};
export function createThumbnail(url: any, width?: undefined, height?: undefined, proxy_url?: undefined): {
    url: any;
    width: undefined;
    height: undefined;
    proxy_url: undefined;
};
export function createVideo(url: any, width?: undefined, height?: undefined, proxy_url?: undefined): {
    url: any;
    width: undefined;
    height: undefined;
    proxy_url: undefined;
};
