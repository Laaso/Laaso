/* Database configuration
 * 
 *  Laaso makes use of the Knex.js library in order to allow users to choose their
 *  own database in a relatively painless manner. Default configurations are provided
 *  for MySQL, PostgreSQL, and SQLite3. Other Knex-compatible databases may work but
 *  are not supported nor tested for use with Laaso.
 * 
 *  You should install the appropriate driver for the database you want to use using
 *  npm or yarn:
 *  Database        npm driver
 *  MySQL           mysql / mysql2
 *  PostgreSQL      pg
 *  SQLite3         sqlite3
 * 
 *  For more documentation on Knex.js, you can visit here:
 *      https://knexjs.org
 */

module.exports = {
    client     : 'mysql2', // Knex client to use.
    // Client connection options. These depend on the above client.

    // MySQL / MySQL2
    connection : {
        host     : '127.0.0.1',
        user     : 'laaso',
        password : 'abcd1234',
        database : 'laaso'
    },

    /* // PostgreSQL
     * connection: process.end.PG_CONNECTION_STRING,
     * searchPath: ['knex', 'public'],
    */

    /* // SQLite3
     * connection : {
     *     filename: './laaso.sqlite'
     * },
    */

    // Connection pool options.
    // Note that this is ignored by SQLite3, as it uses a file.
    pool: {min: 0, max: 10},

    // Set this to true if you are a developer who needs verbose db queries.
    debug: true
};