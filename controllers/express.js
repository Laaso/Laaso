const express = require('express');
const fs = require('fs');
const app = module.exports = express();
const laasocfg = require('../config/laaso');

// Set Express config.
require('../config/express');

// Put on our helmet
app.use(require('helmet')(require('../config/helmet')));

// Set up our routes
app.use(express.static('public'));
app.use(require('../routes'));

// Render the requested page
app.get('*',async (req,res) => {
    let page = req.path;
    if(page === '/') {page = '/index';}

    let exists = fs.existsSync('./views/pages/'+ page +'.ejs');

    if(exists) {
        res.render('layout',{page:page,cfg:laasocfg});
    } else {
        res.status(404).send('Not found.');
    }
    
});