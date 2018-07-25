const router = require('express').Router();
const laasocfg = require('../config/laaso');
const fs = require('fs');

// Provide additional methods
router.get('*', (req,res,next) => {
    res.altRender = (page = req.originalUrl, extra = {}) => {
        console.log('altRender('+ page +')');
        let exists = fs.existsSync('./views/pages/'+ page +'.ejs');

        if(exists) {
            console.log('\texists');
            let ejsvars = {page:page, cfg:laasocfg, express:{req:req,res:res}};

            Object.assign(ejsvars,extra);
            res.render('layout', ejsvars);
            return true;
        }

        return false;
    };

    return next();
});

// Render static pages if found
router.get('*', (req,res,next) => {
    let page = req.path;
    if(page === '/') {page='/index';}

    // Render the page, if able. Pass responsibility otherwise.
    if(!res.altRender(page)) {
        return next();
    }
});

module.exports = router;