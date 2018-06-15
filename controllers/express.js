const express = require('express');
const app = module.exports = express();

// Set Express config.
require('../config/express');

// Put on our helmet
app.use(require('helmet')(require('../config/helmet')));

// Set up our routes
app.use(express.static('public'));
app.use(require('../routes'));

app.get('/',async (req,res) => {
    res.render('layout', {page:'index'});
});