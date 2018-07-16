const router = require('express').Router();

// global middleware called before all others
router.use(require('./middleware'));

router.use('/api', require('./wss'));
router.use('/user', require('./usermgmt'));
router.use('/', require('./auth'));

// Global middleware called after, namely error handlers and a 404 catch all
router.use(require('./handlers'));

module.exports = router;