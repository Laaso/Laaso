const router = require('express').Router();
const multer = require('multer');

const upload = multer();

router.use(upload);

module.exports = router;