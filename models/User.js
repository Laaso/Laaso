const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../controllers/database');
const App = require('./App');
const cfg = require('../config/laaso');
const flake = require('../controllers/snowflake');
const flakecfg = require('../config/snowflake');
const jwtcfg = require('../config/jwt');

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

    /**
     * Checks password against password in database using bcrypt.
     * @param {string} pass 
     * @returns {boolean} True if the password is correct. False otherwise.
     */
    async checkPassword(pass) {
        let matches;
        let r;
        let user;

        try {
            // Get users with this ID
            r = await db.table('users').select().where({id:this.id});

            // Can't log in as nobody
            if(!r.length) {return false};

            // Get first(only) row
            user = r[0];

            // Compare using bcrypt
            matches = bcrypt.compare(pass, user.password);
        } catch(err) {
            // Self log the error
            App.laaso.log('error', 'db_err', {operation:'compare passwords', id:this.id});
            return false;
        }

        // Return whether the password was a match
        return matches;
    }

    /**
     * Gets a token for the user, generating a new one if needed, and returns said token.
     */
    async getToken() {
        let r;
        let token;

        try {
            // Get the most recent token grant for this user.
            r = await db.table('token_grants').select().where({id:this.id}).limit(1);

            if(!r.length) {return undefined;}

            token = r[0];

            console.log(token.dateTime);
        } catch (err) {
            App.laaso.log('error','db_err', {operation:'get token', id:this.id});
            return undefined;
        }
    }

    /**
     * Generates a token for a user, able to regenerate past tokens given a timestamp.
     * Note that timestamps are since the Laaso epoch, in seconds.
     * @param {number} [timestamp] timestamp to generate the token for, in seconds
     */
    async generateToken(timestamp) {
        return jwt.sign({
            iat: timestamp || (new Date() - flakecfg.timeOffset)/1000,
            uid: this.id
        }, jwtcfg.secret);
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

            // The user we need is the first
            user = r[0];
        } catch(err) {
            // Log the failure
            App.laaso.log('error', 'db_err', {operation:'get user', id:id});
            return undefined;
        }

        return new User(user.id, user.name);
    }

    /**
     * Creates a User given credentials and returns the user if successful.
     * @param {string} username Login username for the user. Must be unique.
     * @param {string} password Login password for the user. Will be hashed and all that jazz, but this should be raw.
     * @returns {string|undefined} On success, the User's ID will be returned. On failure, undefined.
     */
    static async createAndSave(username, password) {
        try {
            let takenName, id, hash;

            // Check if users exist with that name
            takenName = await db.select().from('users').where({'username':username}).limit(1);

            if(takenName.length > 0) {
                // The username is taken. These are supposed to be unique per user.
                return {code:'USERNAME_EXISTS',readable:'That username is taken by another user.'};
            }

            id = await flake.gen();

            // We can assume the username is not taken, so we can hash and store the supplied password now.
            hash = bcrypt.hashSync(password, SALT_ROUNDS);

            await db.table('users').insert({id:id, username:username, password:hash});

            return id;
        } catch(error) {
            App.laaso.log('error','db_err',{operation:'save user', err: error});
        }
    }
}

module.exports = User;