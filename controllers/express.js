const express = require('express');
const session = require('express-session');
const fs = require('fs');
const app = module.exports = express();
const sessioncfg = require('../config/session');
const passport = require('./passport');
const KnexSessionStore = require('connect-session-knex')(session);
const db = require('./database');
const store = new KnexSessionStore({knex:db});

Object.assign(sessioncfg.cookie, {store:store});

// Set Express config.
require('../config/express');

// Put on our helmet
app.use(require('helmet')(require('../config/helmet')));

// Set up passport
app.use(session(sessioncfg));
app.use(passport.initialize());
app.use(passport.session());

// Set up our routes
app.use(express.static('public'));
app.use(require('../routes'));