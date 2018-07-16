const router = require('express').Router();

// This router requires authentication
router.use((req,res,next) => {
    if(!req.user) {return res.redirect('/');}
    return next();
});

router.get('/', (req,res,next) => {

});

module.exports = router;