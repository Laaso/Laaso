const router = require('express').Router();

router.use('/api', require('./wss'));
router.use('/', require('./auth'));

module.exports = router;