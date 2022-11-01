class Output {
    /**
     *
     * @param  {...any} values
     * @returns
     */
    setValues(...values) {
        this.values = values;

        return this;
    }

    /**
     *
     * @param {Error} error
     * @returns
     */
    setError(error) {
        this.error = error;

        return this;
    }

    /**
     *
     * @param {string} message
     * @returns
     */
    makeError(message) {
        this.error = new Error(message);

        return this;
    }

    /**
     *
     * @returns
     */
    getErrors() {
        return this.error;
    }

    /**
     *
     * @returns
     */
    getContent() {
        return {
            content: this.content.filter((v) => typeof v !== 'object').join('\n'),
            embeds: this.embeds,
            files: this.files
        };
    }

    /**
     *
     * @param {string} key
     * @param {*} value
     * @returns
     */
    setOption(key, value) {
        this.options.set(key, value);

        return this;
    }

    /**
     *
     * @param {string} key
     * @returns
     */
    getOption(key) {
        return this.options.get(key);
    }

    /**
     *
     * @param  {...import("../handlers/embed-handler").MessageEmbed} embeds
     * @returns
     */
    addEmbed(...embeds) {
        this.embeds = [...this.embeds, ...embeds.map((e) => e.build())];

        return this;
    }

    addFile(...files) {
        this.files = [...this.files, ...files];

        return this;
    }

    /**
     *
     * @param {function(*):void?} fn
     * @returns
     */
    resolve(fn) {
        if (fn)
            fn(this);

        return Promise.resolve(this);
    }

    /**
     *
     * @param {function(*):void?} fn
     * @returns
     */
    reject(fn) {
        if (fn)
            fn(this);

        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject(this);
    }

    /**
     *
     * @param {function(*):void} fn `Promise.resolve` or `Promise.reject`
     * @returns
     */
    handleAsync(fn) {
        return fn(this);
    }

    /**
     *
     * @param {Error} err
     * @param {function(*):void} reject
     * @returns
     */
    handleCatch(err, reject) {
        this.setError(err);

        return this.handleAsync(reject);
    }

    /**
     *
     * @param  {...any} content
     */
    constructor(...content) {
        this.content = content;
        /**
         * @type {Error}
         */
        this.error = null;
        this.values = [];
        /**
         * @type {import("discord.js").APIEmbed[]}
         */
        this.embeds = [];
        this.files = [];

        /**
         * @type {Map<string, *>}
         */
        this.options = new Map();
    }
}

module.exports = Output;
