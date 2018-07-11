/* Laaso configuration
 * 
 *  Configuration for the Laaso server itself.
 */
module.exports = {
    // If true, registrations are closed.
    // The /register page will show an error if accessed, and the homepage will grey out the register button.
    registrationsClosed : false,

    // Password requirements
    // Comment out rules you don't want to enforce.
    // Note that should you modify these, the UI will not reflect changes.
    // You can update those in /views/pages/register.ejs
    // You can add extra rules as well, just add regex like below.
    passwordRules: [
        // New passwords should...
        // Have uppercase characters
        /[A-Z]/,
        // Have lowercase characters
        /[a-z]/,
        // Have numbers
        /\d/,
        // Only contain type-able ascii characters (on a us keyboard)
        /^[ -~]*$/,
        // Be between 8 and 100 characters long
        /^.{8,100}$/
    ]
};