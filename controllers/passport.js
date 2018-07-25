const passport = require('passport');
const LocalStrat = require('passport-local').Strategy;
const JWTStrat = require('passport-jwt').Strategy;

const User = require('../models').User;
const cfg = require('../config/jwt').passport;

passport.use(new LocalStrat(
    async (username, pass, done) => {
        let user;
        let s;
        
        try {
            // Get the user
            user = await User.getOneByUsername(username);

            // Check the user exists
            if(!user) {return done(null, false);}

            // Check their password
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

passport.use(new JWTStrat(cfg,
    async (payload, done) => {
        let id = payload.id;
        let user;

        try {
            user = await User.getById(id);
        } catch(err) {
            console.log(err);
            return done(err);
        }

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
