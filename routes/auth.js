const router = require('express').Router();
const multer = require('multer');
const passport = require('passport');

const upload = multer({
    limits: {
        files: 0
    }
});

router.post('/login', upload.single(), (req,res,next) => {
    let uname = req.body.username;
    let pass = req.body.password;

    // These cannot be empty. Don't bother wasting resources.
    if(uname === undefined || pass === undefined) {
        console.log('one of the two fields is empty');
        res.redirect('/login?autherror=emptyfield');
        return;
    }

    // Authenticate the user
    passport.authenticate('local', (err, user, info) => {
        console.log(info);
        if(err) {return next(err);}

        if(!user) {
            console.log('bad creds');
            return res.redirect('/login?autherror=incorrect');
        }

        req.login(user, (err) => {
            if(err) {return next(err);}
            console.log('ok_hand');

            return res.redirect('/?login');
        });
    })(req, res, next);
});

module.exports = router;