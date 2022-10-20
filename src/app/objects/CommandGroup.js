class CommandGroup {

    /**
     *
     * @param {import('./Command')} command
     * @returns
     */
    addCommand(command) {
        this.collection.push(command);

        console.log('Added command:', command.name);

        return this;
    }

    /**
     *
     * @returns
     */
    getCommands() {
        return this.collection;
    }

    /**
     *
     * @param {string} name
     */
    constructor(name) {
        this.name = name;

        /**
         * @type {Command[]}
         */
        this.collection = [];
    }
}

module.exports = CommandGroup;