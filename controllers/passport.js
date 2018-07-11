const passport = require('passport');
const LocalStrat = require('passport-local').Strategy;

const User = require('../models').User;

passport.use(new LocalStrat(
    async function(username, pass, done) {
        let user;
        let s;
        
        try {
            // Get the user
            user = await User.getOneByUsername(username);
        } catch(err) {
            console.log(err);
            return done(err);
        }

        // Check the user exists
        if(!user) {return done(null, false);}
        
        // Check their password is correct
        try {
            s = await user.checkPassword(pass);
        } catch(err) {
            console.log(err);
            return done(err);
        }

        // If the password is incorrect
        if(!s) {
            return done(null, false);
        }

        // User authenticated successfully!
        return done(null, user);
    }
));

passport.serializeUser((user,cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    User.getById(id).then((res) => {
        cb(null, res);
    }).catch((err) => {
        console.log(err);
    });
});

module.exports = passport;