const db = require('../controllers/database');

/**
 * Represents an application which may send logs
 * @typedef {Object} App
 * @property {string} id
 * @property {string} name
 * @property {string} owner
 */
class App {
    /**
     * Creates an App object
     * @param {string} id - Snowflake ID of the app
     * @param {string} name - Name of the app
     * @param {string} owner Snowflake ID of the owner
     */
    constructor(id, name, owner) {
        this.id = id;
        this.name = name;
        this.owner = owner;
    }

    /**
     * Log message to the database
     * @param {string} level - Log urgency level
     * @param {string} event - Event requiring logging
     * @param {Object|string} message - Message
     * @returns {undefined}
     */
    async log(level, event, message) {
        // If it's an array or otherwise not an object, we must slightly tweak it
        if(Array.isArray(message) || !typeof message === 'object') {
            message = {msg:message};
        }

        try {
            // Add the log to the database
            await db.table('event_log').insert({
                app:this.name,
                level:level,
                event:event,
                message:JSON.stringify(message)
            });
        } catch(err) {
            // If Laaso fails to log to itself, log to console to avoid loops
            if(this.id===0) {
                console.error(`Failed to log message!\n\t${err}`)
                return;
            }

            // Add meta data to the logged message
            let msg = {}
            msg.error = err;
            msg._meta = {
                app: this.name,
                level: level,
                event: event,
                message: message
            }

            // Log the message as laaso
            App.laaso.log('error', 'db_failure', msg);
        }
    }

    /**
     * Deletes the app, all logged events, and token grants
     * @returns {undefined}
     */
    delete() {
        try {
            // Delete the app
            db.table('apps').delete().where({id:this.id}).return();

            // Delete tokens
            db.table('token_grants').delete().where({app:this.id}).return();

            // Delete logged messages
            db.table('event_log').delete().where({app:this.id}).return();
        } catch(err) {
            App.laaso.log('error', 'db_failure', {operation:'delete', id:this.id});
            return undefined;
        }
    }

    /**
     * Updates the object in the db if it exists, creates it otherwise.
     * @returns {undefined}
     */
    async save() {
        if(await this.getOne(this.id) === undefined) {
            // If the app doesn't exist, create it
            await db.table('apps').insert({app:this.name, owner:this.owner});
        } else {
            // If the app exists, update it
            await db.table('apps').update({app:this.name, owner:this.owner}).where({id:this.id});
        }
    }

    /* Static Database Functions */

    /**
     * Gets User given an ID
     * @param {string} id - Snowflake ID of desired App
     * @returns {App|undefined} App, or undefined if app doesn't exist
     */
    static async getOne(id) {
        let app;
        let r;

        try {
            r = await db.table('apps').select().where({id:id});

            // No app found
            if(!r.length) {return undefined;}
            // Multiple apps found, uses first
            if(r.length > 1) {App.laaso.log('warn', 'duplicate_id', {id:id});}

            app = r[0];
        } catch(err) {
            // Log the failure
            App.laaso.log('error', 'db_failure', {operation:'get', id:id});
            return undefined;
        }

        return app;
    }
}

// Define the default Laaso app for self logging
App.laaso = new App(0,'Laaso',0);

module.exports = App;