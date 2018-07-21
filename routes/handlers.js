const router = require('express').Router();
const laasocfg = require('../config/laaso');

router.get('*', (req,res) => {
    console.log(`404 ERROR: ${req.originalUrl}`);
    return res.status(404).altRender('error_404');
});

module.exports = router;