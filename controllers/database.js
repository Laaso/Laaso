const cfg = require('../config');
const knex = require('knex')(cfg);

// Perform a simple query to confirm our configuration is valid
knex.raw('SELECT 1+1 AS RESULT').then(() => {
    console.log('Database connection successful.');
}).catch((err) => {
    // Laaso cannot function without a valid database
    // Output the error code and exit
    console.log('Error connecting to database.');
    console.log(err.code);
    process.exit(1);
});

module.exports = knex;