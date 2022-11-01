export type Column = {
    name: string;
    dataType: string;
    primaryKey?: boolean;
    foreignKey?: {
        table: string;
        column: string;
    };
    nullable?: boolean;
    default?: any;
};
export type Table = {
    name: string;
    columns: Column[];
};
/**
 *
 * @param {{user: string, password: string, host: string, database: string, port: number}} config
 * @returns
 */
export function login(config: {
    user: string;
    password: string;
    host: string;
    database: string;
    port: number;
}): Pool;
/**
 *
 * @param {string} str
 * @returns
 */
export function query(str: string): Promise<any>;
/**
 *
 * @param {string} table
 * @param {*} options
 * @returns
 */
export function select(table: string, options?: any): Promise<any>;
/**
 *
 * @param {string} table
 * @returns {Promise<boolean>}
 */
export function exists(table: string): Promise<boolean>;
/**
 *
 * @param {*} table
 * @param {*} data
 * @returns
 */
export function add(table: any, data: any): Promise<any>;
/**
 *
 * @param {Table[]} tables
 * @returns
 */
export function preloadTables(tables: Table[], reset?: boolean): Promise<any>;
/**
 *
 * @param {*} table
 * @returns
 */
export function describe(table: any): Promise<any>;
/**
 *
 * @param {*} table
 * @returns
 */
export function getPrimaryKey(table: any): Promise<any>;
/**
 *
 * @param {string} table
 * @returns {Promise<{table: string, column: string, ref_table: string, ref_column: string}[]>}
 */
export function getForeignKeys(table: string): Promise<{
    table: string;
    column: string;
    ref_table: string;
    ref_column: string;
}[]>;
