const { Pool } = require('pg');

/**
 * @type {Pool}
 */
let pool = null;

/**
 *
 * @param {{user: string, password: string, host: string, database: string, port: number}} config
 * @returns
 */
function login(config) {
    pool = new Pool(config);

    return pool;
}

/**
 *
 * @param {*} v
 * @returns
 */
function formatValue(v) {
    switch (typeof v) {
        case 'string': return `'${v}'`;
        default: return v;
    }
}

/**
 *
 * @param {string} str
 * @returns
 */
function query(str) {
    if (pool === null)
        return Promise.reject(new Error('No connection.'));

    return new Promise((resolve, reject) => {
        pool.query(str, (err, result) => {
            if (err) {
                console.error(str);
                reject(err);
            }
            else
                resolve(result);
        });
    });
}

/**
 *
 * @param {string} table
 * @param {*} options
 * @returns
 */
function select(table, options = {}) {
    let opts = [];

    for (let key in options)
        opts.push(`${key} = ${formatValue(options[key])}`);

    let str = `select * from ${table}`;
    if (opts.length)
        str += ` where ${opts.join(' and ')}`;

    return query(str);
}

/**
 *
 * @param {string} table
 * @returns {Promise<boolean>}
 */
function exists(table) {
    return new Promise((resolve, reject) => {
        query(`select exists (select table_name from information_schema.tables where table_name = '${table}')`)
            .then((result) => resolve(result.rows[0].exists))
            .catch((err) => reject(err));
    });
}

/**
 * @typedef {{name: string, dataType: string, primaryKey?: boolean, foreignKey?: {table: string, column: string}, nullable?: boolean, default?: *}} Column
 *
 * @typedef {{name: string, columns: Column[]}} Table
 */

/**
 *
 */
function loadTableFromList(list, index) {
    const table = list[index];

    let columns = [];

    console.log('Adding table:', table.name);

    table.columns.forEach((column) => {
        let str = `${column.name} ${column.dataType}`;

        if (!column.nullable)
            str += ' not null';

        if (column.default !== undefined) {
            str += ' default ';

            if (typeof column.default === 'string')
                str += `'${column.default}'`;
            else
                str += column.default;
        }

        if (column.primaryKey)
            str += ' primary key';
        else if (column.foreignKey)
            str += ` references ${column.foreignKey.table}(${column.foreignKey.column})`;

        columns.push(str);
    });

    let q = `create table if not exists ${table.name} (${columns.join(', ')})`;

    return new Promise((resolve, reject) => {
        query(q)
            .then(() => {
                if (index < list.length - 1)
                    loadTableFromList(list, index + 1)
                        .then((r) => resolve(r))
                        .catch((err) => reject(err));
                else
                    resolve(true);
            })
            .catch((err) => {
                console.log(q);
                reject(err);
            });
    });
}

/**
 *
 * @param {*} list
 * @param {*} index
 * @returns
 */
function deleteTablesFromList(list, index) {
    const table = list[index];

    console.log('Dropping table: ' + table.name);

    return new Promise((resolve, reject) => {
        exists(table.name)
            .then((has) => {
                if (!has) {
                    console.log(table.name + ' does not exist.');
                    resolve(false);
                }
                else {
                    query(`delete from ${table.name}`)
                        .then(() => {
                            console.log('Deleted entries.');

                            query(`drop table ${table.name}`)
                                .then(() => {
                                    console.log('Dropped table.');

                                    if (index < list.length - 1)
                                        deleteTablesFromList(list, index + 1)
                                            .then((r) => resolve(r))
                                            .catch((err) => reject(err));
                                    else
                                        resolve(true);
                                })
                                .catch((err) => reject(err));
                        })
                        .catch((err) => reject(err));
                }
            })
            .catch((err) => reject(err));
    });
}

/**
 *
 * @param {Table[]} tables
 * @returns
 */
function preloadTables(tables, reset = false) {
    if (!Array.isArray(tables))
        return Promise.reject('Cannot preload database tables - not an array.');

    if (reset) {
        return new Promise((resolve, reject) => {
            deleteTablesFromList(tables, 0)
                .then(() => {
                    preloadTables(tables)
                        .then((r) => resolve(r))
                        .catch((err) => reject(err));
                })
                .catch((err) => reject(err));
        });
    }

    return loadTableFromList(tables, 0);
}

/**
 *
 * @param {*} table
 * @returns
 */
function getPrimaryKey(table) {
    let str = 'SELECT ' +
        'pg_attribute.attname, ' +
        'format_type(pg_attribute.atttypid, pg_attribute.atttypmod) ' +
        'FROM ' +
        'pg_index, pg_class, pg_attribute, pg_namespace ' +
        'WHERE ' +
        `pg_class.oid = '${table}'::regclass ` +
        'AND ' +
        'indrelid = pg_class.oid ' +
        'AND ' +
        'nspname = \'public\' ' +
        'AND ' +
        'pg_class.relnamespace = pg_namespace.oid ' +
        'AND ' +
        'pg_attribute.attrelid = pg_class.oid ' +
        'AND ' +
        'pg_attribute.attnum = any(pg_index.indkey) ' +
        'AND ' +
        'indisprimary';

    return new Promise((resolve, reject) => {
        query(str)
            .then((result) => {
                let col = result.rows[0];
                if (col)
                    resolve(col.attname);
                else
                    reject(new Error('Could not find primary key.'));
            })
            .catch((err) => reject(err));
    });
}

/**
 *
 * @param {string} table
 * @returns {Promise<{table: string, column: string, ref_table: string, ref_column: string}[]>}
 */
function getForeignKeys(table) {
    let str = 'SELECT ' +
        'tc.table_schema, ' +
        'tc.constraint_name, ' +
        'tc.table_name, ' +
        'kcu.column_name, ' +
        'ccu.table_schema AS foreign_table_schema, ' +
        'ccu.table_name AS foreign_table_name, ' +
        'ccu.column_name AS foreign_column_name ' +
        'FROM ' +
        'information_schema.table_constraints AS tc ' +
        'JOIN information_schema.key_column_usage AS kcu ' +
        'ON tc.constraint_name = kcu.constraint_name ' +
        'AND tc.table_schema = kcu.table_schema ' +
        'JOIN information_schema.constraint_column_usage AS ccu ' +
        'ON ccu.constraint_name = tc.constraint_name ' +
        'AND ccu.table_schema = tc.table_schema ' +
        `WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = '${table}'`;

    return new Promise((resolve, reject) => {
        query(str)
            .then((result) => {
                const { rows } = result;

                resolve(
                    rows.map((row) => (
                        {
                            table,
                            column: row.column_name,
                            ref_table: row.foreign_table_name,
                            ref_column: row.foreign_column_name
                        }
                    ))
                );
            })
            .catch((err) => reject(err));
    });
}

/**
 *
 * @param {*} table
 * @returns
 */
function describe(table) {
    let str = `select column_name, data_type, character_maximum_length, column_default, is_nullable from INFORMATION_SCHEMA.COLUMNS where table_name = '${table}'`;

    return query(str);
}

/**
 *
 * @param {*} table
 * @param {*} data
 * @returns
 */
function add(table, data) {
    const keys = Object.keys(data);
    const values = Object.values(data).map((value) => {
        if (typeof value === 'string' && !/'[^']*'/.test(value))
            value = `'${value}'`;

        return value;
    });

    return query(`insert into ${table} (${keys.join(', ')}) values (${values.join(', ')})`);
}

module.exports = {
    login,
    query,
    select,
    exists,
    add,
    preloadTables,
    describe,
    getPrimaryKey,
    getForeignKeys
};