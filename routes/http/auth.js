const router = require('express').Router();
const User = require('../../models/').User;

router.get('/login', (req,res,next) => {
    let uname = req.body.username;
    let password = req.body.password;


});

module.exports = router;