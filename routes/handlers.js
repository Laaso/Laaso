const router = require('express').Router();
const laasocfg = require('../config/laaso');

router.get('*', (req,res) => {
    res.status(404);
});

module.exports = router;