/* JSONWebToken Configuration
 *
 * These settings change how app tokens are generated.
 * Note that changing these settings will INVALIDATE any existing tokens.
 * Make sure you change the secret, otherwise it'll be excessively easy to forge tokens.
 * 
 * More information on JWT can be found here:
 *     https://github.com/auth0/node-jsonwebtoken
 */

module.exports = {
    secret : 'keyboard cat',
    signing : {
        // Set this to a time (in seconds) for tokens to be considered valid.
        // If undefined, tokens are valid until manually invalidated.
        // expiresIn: 3600*24*7*30,

        // Set this to a time (in seconds) after creation for tokens to be considered invalid.
        // Use this if you'd like to assign tokens for future use, not immediate use.
        // notBefore: 0
    },
    checking : {
        // Set this to a time (in seconds) to give tolerance on expiry times to account for
        // differences in system times. Has no effect if tokens do not expire.
        clockTolerance: undefined
    }
};