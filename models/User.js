const App = require('./App');
const db = require('../controllers/database');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 13;

class User {
    constructor(id, username, apps) {
        this.id = id;
        this.username = username;
        this.apps = apps;
    }

    /**
     * Creates a new app for a user, if one with the given name doesn't already exist.
     * Has no effect if an identically named app exists for this user.
     * @param {string} name The name of the new app
     * @returns {Promise<id>} ID of the new app, or the existing app if one was found.
     */
    async createApp(name) {
        let app;
        let r = await db.table('apps').select().where({appname: name, ownerid: this.id}).limit(1);
        
        // If an app was found
        if(r.length !== 0) {
            return r[0].id;
        }

        r = await db.table('apps').insert({appname:name, ownerid:this.id});
        let appid = r[0];

        app = await App.getOne(appid);
        // Grant a token to the new app
        app.grantToken();

        return appid;
    }

    /**
     * Gets the first user matching a given username
     * Usernames should be unique, but in the rare odd case they aren't...
     * Good luck.
     * @param {*} username 
     * @returns {(Promise<User>|undefined)} A user if one matches. Undefined otherwise. 
     */
    static async getOneByUsername(username) {
        let r = await db.table('users').select().where({username: username}).limit(1);
        let ri;

        if(!r.length) {return undefined;}
        ri = r[0];

        return new User(ri.id, ri.username, {});
    }

    /**
     * Gets the first (and hopefully only) user with a given ID.
     * @param {number} id 
     * @returns {(Promise<User>|undefined)} A user if one matches. Undefined otherwise. 
     */
    static async getById(id) {
        let r = await db.table('users').select().where({id: id}).limit(1);
        let ri;

        if(!r.length) {return undefined;}
        ri = r[0];

        return new User(ri.id, ri.username, {});
    }

    /**
     * Creates a new user with the given username and password
     * @param {string} username 
     * @param {string} password
     * @returns {Promise<number>} New user's ID. 
     */
    static async create(username, password) {
        let hashedPass = await bcrypt.hash(password, SALT_ROUNDS);
        let r = await db.table('users').insert({username: username, password: hashedPass});
        return r[0];
    }

    /**
     * To prevent user passwords from being accessed by any other part of this app,
     * this method must be used to check supplied passwords with stored ones.
     * 
     * Yes, passwords are hashed, salted, all that jazz, but there is no reason any
     * other part of the code should have access to them.
     * @param {string} password 
     * @returns {Promise<boolean>} True if the password was accepted. False otherwise.
     */
    async checkPassword(password) {
        let r = await db.table('users').select().where({id: this.id}).limit(1);

        // User doesn't exist
        if(!r.length) {return false;}
        let pass = r[0].password;
        return await bcrypt.compare(password, pass);
    }
}

module.exports = User;