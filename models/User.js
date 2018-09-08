const bcrypt = require('bcrypt');

const db = require('../controllers/database');
const App = require('./App');
const cfg = require('../config/laaso');

const SALT_ROUNDS = cfg.salt_rounds;

/**
 * Represents a Laaso user.
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 */
class User {
    /**
     * Creates a basic User object. This object has none of the user's apps
     * @param {string} id - Snowflake ID of the user
     * @param {string} name - Name of the user
     */
    constructor(id, name) {
        // TODO: Get apps for the user.
        this.id = id;
        this.name = name;
    }



    /* Static Database Functions */

    /**
     * Gets User given an ID
     * @param {string} id - Snowflake ID of desired User
     * @returns {User|undefined} Desired user or undefined if user doesn't exist
     */
    static async getOne(id) {
        let user;
        let r;

        try {
            r = await db.table('users').select().where({id:id});

            // No user found
            if(!r.length) {return undefined;}
            // Multiple users found, uses first
            if(r.length > 1) {App.laaso.log('warn','duplicate_id',{id:id});}

            // The user we need is the first
            user = r[0];
        } catch(err) {
            // Log the failure
            App.laaso.log('error', 'db_failure', {operation:'get', id:id});
            return undefined;
        }

        return user;
    }

    /**
     * Creates a User given credentials and returns the user if successful.
     * @param {string} username Login username for the user. Must be unique.
     * @param {string} password Login password for the user. Will be hashed and all that jazz, but this should be raw.
     * @returns {User|object} On success, the User's new object will be returned. On failure, an object containing the error.
     */
    static async createAndSave(username, password) {
        try {
            // Check if users exist with that name
            let takenName = await db.select().from('users').where({'username':username}).limit(1);

            if(takenName.length > 0) {
                // The username is taken. These are supposed to be unique per user.
                return {code:'USERNAME_EXISTS',readable:'That username is taken by another user.'};
            }

            // We can assume the username is not taken, so we can hash and store the supplied password now.
            await bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
                if(err) {
                    // Pass the error up for handling
                    throw err;
                }

                db('users').insert({username:username, password:hash});
            });

            // Simply return the result of our getOne method
        }
    }
}

module.exports = User;