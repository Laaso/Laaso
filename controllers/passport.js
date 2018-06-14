const passport = require('passport');
const LocalStrat = require('passport-local').Strategy;
const JWTStrat = require('passport-jwt').Strategy;
const app = require('../');

const User = require('../models').User;

passport.use(new LocalStrat(
    function(uname, pass, cb) {
        User.getOneByUsername(uname).then((user) => {
            if(!user) {return cb(null, false);}
            if(!user.checkPassword(pass)) {return cb(null, false);}

            return cb(null, user);
        }).catch((err) => {
            return cb(err);
        });
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

app.use(passport.initialize());
app.use(passport.session());

module.exports = passport;