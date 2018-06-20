const jwt = require('jsonwebtoken');
const db = require('../controllers/database');
const cfg = require('../config/jwt');

class App {
    constructor(id, name, owner) {
        this.id = id;
        this.name = name;
        this.owner = owner;
    }

    /**
     * Grants a token to the app, invalidating older tokens.
     * An app may only have one valid token at any time.
     * @returns {Promise<string>} The new token.
     */
    async grantToken() {
        // Create then fetch the default timestamp for the token.
        await db.table('token_grants').insert({application: this.id});
        
        // We now have a new effective token, so we can just return that.
        return this.getEffectiveToken();
    }

    /**
     * gets the most recent, and only valid token
     * @returns {Promise<string>} The effective token.
     */
    async getEffectiveToken() {
        let payload = {};
        let r;

        // Get the most recent token grant
        r = await db.table('token_grants').select().where({application:this.id}).orderBy('datetime', 'desc').limit(1);

        // JWT uses seconds, so divide the timestamp provided by SQL by 1,000
        
        payload.iat = new Date(r[0].datetime).valueOf() / 1000;
        payload.appid = this.id;

        // Sign our token and return it.
        return jwt.sign(payload, cfg.secret, cfg.signing);
    }

    /**
     * Logs en event
     * @param {string} level Level. You may use anything, though only 'warn' and 'error' produce alerts.
     * @param {string} type Event type
     * @param {JSON} msg Json-formatted message. Strings containing JSON are accepted
     * @throws {Error} If the message isn't a JSON Object
     */
    async addLogEntry(level, type, msg) {
        try {
            if(typeof msg !== 'object' && typeof msg !== undefined) {throw new Error();}
            if(Array.isArray(msg)) {throw new Error();}
        } catch(err) {
            throw {
                code : 'NOT_JSON_OBJ',
                message : 'message may only be a JSON-formatted object'
            };
        }

        let r = await db.table('event_log').insert({
            app : this.id,
            level : level || 'info',
            type : type,
            message : JSON.stringify(msg)
        });

        return r[0];
    }

    /**
     * Deletes the App and everything in the database about it
     * Acts asyncronously.
     */
    delete() {
        // Delete tokens
        db.table('token_grants').delete().where({application:this.id}).return();
        // Delete the app itself
        db.table('apps').delete().where({id:this.id}).return();
    }

    /**
     * Gets the first (and hopefully only) app with a given ID.
     * @param {number} id
     * @returns {Promise<App>|undefined} An app if one matches. Undefined otherwise. 
     */
    static async getOne(id) {
        let r = await db.table('apps').select().where({id:id}).limit(1);
        let ri;

        if(!r.length) {return undefined;}
        ri = r[0];

        return new App(ri.id, ri.appname, ri.ownerid);
    }

    /**
     * Gets the app represented by a valid token
     * @param {string} token Token to check for validity and app
     * @returns {Promise<App>} The app the token is valid for
     */
    static async getByToken(token) {
        let decoded;

        try {
            let etoken;
            let app;

            decoded = await jwt.verify(token, cfg.secret, cfg.checking);

            app = await App.getOne(decoded.appid);
            etoken = await app.getEffectiveToken();

            // If this token is anything but the effective token, it's invalid.
            if(etoken !== token) {
                throw new jwt.TokenExpiredError('jwt expired', etoken.iat);
            }

            // Everything checks out, this app is validly represented by the given token.
            return app;
        } catch(err) {
            // TODO: Use Timber's built in app to log things like this
            console.log(err);
            console.log('Invalid token supplied');
            return undefined;
        }
    }
}

module.exports = App;