/* External Dependencies */
const express = require('express');

/* constants and Internal Depencencies */
const app = express();
const db = require('./controllers/database');

// Uses a different authentication system than the normal site, and as such uses a different router.
//app.route('api', require('./routes/api.js'));