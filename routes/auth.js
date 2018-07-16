const router = require('express').Router();
const multer = require('multer');
const passport = require('passport');

const cfg = require('../config/laaso');
const User = require('../models').User;

const upload = multer({
    limits: {
        files: 0
    }
});

router.get('/me', (req,res,next) => {
    return res.json(req.user);
});

// Both auth endpoints should run this when posted to
router.post(['/login','/register'], upload.single(), (req,res,next) => {
    req.uname = req.body.username;
    req.pass = req.body.password;

    // Both fields are REQUIRED!
    if(!req.uname || !req.pass) {
        return res.redirect(req.path +'?error=empty');
    }

    // No issues.
    return next();
});

router.get('/logout', (req,res) => {
    // Just log them out and return them to the landing page.
    req.logout();
    return res.redirect('/?action=logout');
});

router.post('/register', async (req,res,next)  => {
    if(cfg.registrationsClosed) {
        // This should only occur if users are attempting to bypass the UI
        return res.redirect('/');
    }

    // Check password requirements, as enforced by config.
    let valid = true;
    for(let rule of cfg.passwordRules) {
        // If one of the rules doesn't match up
        if(!req.pass.match(rule)) {
            console.log(rule +' doesn\'t match');
            valid=false;
            break;
        }
    }

    // If it doesn't meet the rules
    if(!valid) {
        return res.redirect('/register?error=passwordRules');
    }
    
    try {
        if(await User.getOneByUsername(req.uname) !== undefined) {
            // As much as I'd like to not let users know if a username is taken, it's unavoidable here
            return res.redirect('/register?error=exists');
        }
        await User.create(req.uname, req.pass);
        // Immediately log the new user in
        return next();
    } catch(err) {
        return next(err);
    }
});

// Login middleware, both on login and post-registry
router.post(['/login', '/register'], (req,res,next) => {
    passport.authenticate('local', (err, user) => {
        if(err) {return next(err);}

        // If the user was not authenticated properly
        // Should only occur on login path
        if(!user) {
            return res.redirect('/login?error=incorrect');
        }

        req.login(user, (err) => {
            if(err) {return next(err);}

            // Strip the slash. Home page should respond both to logins and registrations
            return res.redirect('/?action='+ req.path.substring(1));
        });
    })(req, res, next);
});

module.exports = router;
