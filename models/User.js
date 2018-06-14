const db = require('../controllers/database');

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

    /**
     * To prevent user passwords from being accessed by any other part of this app,
     * this method must be used to check supplied passwords with stored ones.
     * 
     * Yes, passwords are hashed, salted, all that jazz, but there is no reason any
     * other part of the code should have access to them.
     * @param {string} password 
     * @returns {boolean} True if the password was accepted. False otherwise.
     */
    static async checkPassword(password) {
        
    }
}

module.exports = User;