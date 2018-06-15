const db = require('../controllers/database');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 13;

class User {
    constructor(id, username, apps) {
        this.id = id;
        this.username = username;
        this.apps = apps;
    }

    static async getOneByUsername(username) {
        let r = await db.table('users').select().where({username: username}).limit(1);
        let ri;

        if(!r.length) {return undefined;}
        ri = r[0];

        return new User(ri.id, ri.username, {});
    }

    static async getById(id) {
        let r = await db.table('users').select().where({id: id}).limit(1);
        let ri;

        if(!r.length) {return undefined;}
        ri = r[0];

        return new User(ri.id, ri.username, {});
    }

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
     * @returns {boolean} True if the password was accepted. False otherwise.
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