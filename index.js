const app = require('./controllers/express');
// Initialize the database.
require('./controllers/database');

app.listen(3000);