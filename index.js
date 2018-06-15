const app = require('./controllers/express');
// We don't care for these exports, but we need to init them before anything else.
require('./controllers/database');
require('./controllers/passport');

app.listen(3000);