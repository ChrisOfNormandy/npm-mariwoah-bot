const CommandGroup = require('./objects/CommandGroup');

const groups = {
    /**
     * @type {Map<string, CommandGroup>}
     */
    cache: new Map(),

    /**
     * 
     * @param {string} name 
     * @returns {CommandGroup}
     */
    addCommandGroup: (name) => {
        if (!groups.cache.has(name))
            groups.cache.set(name, new CommandGroup(name));

        return groups.cache.get(name);
    },

    /**
     * 
     * @param {string} name 
     * @returns {CommandGroup}
     */
    getCommandGroup: (name) => {
        return groups.cache.get(name);
    }
};

module.exports = groups;
