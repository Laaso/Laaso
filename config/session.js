/* Express-Session Configuration
 *
 * Settings for user sessions may be set here. 
 * Most of these settings are fine being left alone.
 * BUT PLEASE FOR THE LOVE OF GOD CHANGE THE SECRET.
 * THE DEFAULT VALUE IS HELLA INSECURE.
 */
module.exports = {
    cookie : {
        // Lifespan of session cookies.
        // Default is 30 days. Change left hand number to configure this.
        maxAge : 30     *24*60*60*1000,

        // sameSite cookie policy
        sameSite: 'lax',

        // Change this to false ONLY if your site does not have HTTPS.
        // Or, just use HTTPS.
        secure: true,

        // Secret used for secure cookie signing.
        // Change this to some sort of string you don't intend on sharing.
        // No, seriously, change this. Please.
        secret: 'keyboard cat',

        // Session ID cookie name
        // If you have multiple Laaso instances running for some odd reason,
        // Change this.
        name: 'laaso.sid',

        // Unless you're using a store besides Knex, don't change these.
        resave: false,
        store: 'connect-session-knex',

        // Unless complying with cookie laws isn't in your interest,
        // Don't change this.
        saveUninitialized: false,

        // Change this to 'keep' if you want to keep sessions around after destruction
        // for some odd reason.
        unset: 'destroy'
    }
};