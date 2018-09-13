const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models').User;
const jwtcfg = require('../config/jwt');

// Build config from jwt config

let cfg = {};
cfg.secretOrKey = jwtcfg.secret;
cfg.jwtFromRequest = ExtractJwt.fromHeader('Authorization');

passport.use(new JwtStrategy(cfg, async (payload, done) => {
    let user = await User.getOne(payload.uid);

    // User was found with this ID. Authentication should be successful.
    if(user instanceof User) {
        return done(null, user);
    }

    // Auth invalid
    return done(null, false);
}));