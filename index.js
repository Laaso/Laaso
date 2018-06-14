/* External Dependencies */
const express = require('express');

/* constants and Internal Depencencies */
const app = module.exports = express();
const db = require('./controllers/database');

app.set('view engine', 'ejs');

// Uses a different authentication system than the normal site, and as such uses a different router.
//app.route('api', require('./routes/api.js'));

app.use('/wss', require('./routes/wss.js'));
app.use(express.static('public'));

app.get('/',(req,res) => {
    res.render('layout', {page:'index'});
});

app.listen(3000);