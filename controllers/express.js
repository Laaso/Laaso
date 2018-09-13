const express = require('express');
module.exports.app = app = express(); 
module.exports.logger = logger = require('../models/').App.laaso;

app.use(require('../routes'));

// TODO: Plan logical router layout.