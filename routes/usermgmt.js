const router = require('express').Router();

// This router requires authentication
router.use((req,res,next) => {
    if(!req.user) {return res.redirect('/');}
    return next();
});

router.get('/apps?/:reference*', (req,res,next) => {
    req.targetApp;
    let ref = req.params.reference;

    for(let i in req.user.apps) {
        let app = req.user.apps[i];
        console.log(app, ref);
        // Apps are unique by name per user, so they can be referenced either way
        if(ref == app.id || ref == app.name) {
            // This is the app we need. Continue on.
            req.targetApp = app;
            return next();
        }
    }

    // The reference was invalid.
    res.altRender('basic', {message:'Invalid app', sub:'The app you requested does not exist.'});
});

router.get('/apps?/:reference/', async (req,res) => {
    req.applog = await req.targetApp.getLogMessages();
    res.altRender('appprofile');
});

router.get('/', (req,res) => {
    // TODO: Style this so it's not just text with a hyperlink and invisible div.
    res.altRender('userprofile');
});

module.exports = router;