export = CommandGroup;
declare class CommandGroup {
    /**
     *
     * @param {string} name
     */
    constructor(name: string);
    /**
     *
     * @param {import('./Command')} command
     * @returns
     */
    addCommand(command: import('./Command')): CommandGroup;
    /**
     *
     * @returns
     */
    getCommands(): Command[];
    name: string;
    /**
     * @type {Command[]}
     */
    collection: Command[];
}
