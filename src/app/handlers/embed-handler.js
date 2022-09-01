const { EmbedBuilder } = require('discord.js');

class MessageEmbed {

    /**
     *
     * @param {import('discord.js').APIEmbedAuthor} author
     * @returns
     */
    setAuthor(author) {
        this.data.author = author;

        return this;
    }

    /**
     *
     * @param {string} name
     * @param  {...any} args See `createAuthor(...)`
     * @returns
     */
    makeAuthor(name, ...args) {
        return this.setAuthor(createAuthor(name, ...args));
    }

    /**
     *
     * @param {number | string} color Decimal color value; will convert hex colors to decimal.
     * @returns
     */
    setColor(color) {
        this.data.color = isNaN(color)
            ? parseInt(color.replace('#', ''), 16)
            : color;

        return this;
    }

    /**
     *
     * @param {string} description
     * @returns
     */
    setDescription(description) {
        this.data.description = description;

        return this;
    }

    /**
     *
     * @param  {...import('discord.js').APIEmbedField} fields
     * @returns
     */
    addField(...fields) {
        if (!this.data.fields)
            this.data.fields = [...fields];
        else {
            let i = 0;
            while (i < fields.length && this.data.fields.length < 25) {
                this.data.fields.push(fields[i]);
                i++;
            }
        }

        return this;
    }

    /**
     *
     * @param {string} name
     * @param {*} value
     * @param  {...any} args See `createField(...)`
     * @returns
     */
    makeField(name, value, ...args) {
        return this.addField(createField(name, value, ...args));
    }

    /**
     *
     * @param {import('discord.js').APIEmbedFooter} footer
     * @returns
     */
    setFooter(footer) {
        this.data.footer = footer;

        return this;
    }

    /**
     *
     * @param {string} text
     * @param  {...any} args See `createFooter(...)`
     * @returns
     */
    makeFooter(text, ...args) {
        return this.setFooter(createFooter(text, ...args));
    }

    /**
     *
     * @param {import('discord.js').APIEmbedImage} image
     * @returns
     */
    setImage(image) {
        this.data.image = image;

        return this;
    }

    /**
     *
     * @param {string} url
     * @param  {...any} args See `createImage(...)`
     * @returns
     */
    makeImage(url, ...args) {
        return this.setImage(createImage(url, ...args));
    }

    /**
     *
     * @param {import('discord.js').APIEmbedProvider} provider
     * @returns
     */
    setProvider(provider) {
        this.data.provider = provider;

        return this;
    }

    /**
     *
     * @param {string} name
     * @param  {...any} args See `createProvider(...)`
     * @returns
     */
    makeProvider(name, ...args) {
        return this.setProvider(createProvider(name, ...args));
    }

    /**
     *
     * @param {import('discord.js').APIEmbedThumbnail} thumbnail
     * @returns
     */
    setThumbnail(thumbnail) {
        this.data.thumbnail = thumbnail;

        return this;
    }

    /**
     *
     * @param {string} url
     * @param  {...any} args See `createThumbnail(...)`
     * @returns
     */
    makeThumbnail(url, ...args) {
        return this.setThumbnail(createThumbnail(url, ...args));
    }

    /**
     *
     * @param {string} timestamp
     * @returns
     */
    setTimestamp(timestamp) {
        this.data.timestamp = timestamp;

        return this;
    }

    /**
     *
     * @param {string} title
     * @returns
     */
    setTitle(title) {
        this.data.title = title;

        return this;
    }

    /**
     *
     * @param {string} url
     * @returns
     */
    setURL(url) {
        this.data.url = url;

        return this;
    }

    /**
     *
     * @param {import('discord.js').APIEmbedVideo} video
     * @returns
     */
    setVideo(video) {
        this.data.video = video;

        return this;
    }

    /**
     *
     * @param {string} url
     * @param  {...any} args See `createVideo(...)`
     * @returns
     */
    makeVideo(url, ...args) {
        return this.setVideo(createVideo(url, ...args));
    }

    /**
     *
     * @returns
     */
    build() {
        return new EmbedBuilder(this.data).toJSON();
    }

    /**
     *
     * @param {import('discord.js').APIEmbed} data
     */
    constructor(data) {
        /**
         * @type {import("discord.js").APIEmbed}
         */
        this.data = data || {};
    }
}

const createAuthor = (name, icon_url = undefined, proxy_icon_url = undefined, url = undefined) => ({ icon_url, name, proxy_icon_url, url });
const createField = (name, value, inline = false) => ({ name, value, inline });
const createFooter = (text, icon_url = undefined, proxy_icon_url = undefined) => ({ text, icon_url, proxy_icon_url });
const createImage = (url, width = undefined, height = undefined, proxy_url = undefined) => ({ url, width, height, proxy_url });
const createProvider = (name, url = undefined) => ({ name, url });
const createThumbnail = (url, width = undefined, height = undefined, proxy_url = undefined) => ({ url, width, height, proxy_url });
const createVideo = (url, width = undefined, height = undefined, proxy_url = undefined) => ({ url, width, height, proxy_url });

module.exports = {
    MessageEmbed,
    createAuthor,
    createField,
    createFooter,
    createImage,
    createProvider,
    createThumbnail,
    createVideo
};