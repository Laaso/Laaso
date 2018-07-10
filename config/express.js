const app = require('../controllers/express');
/* Express.JS Configuration
 *
 * This config file follows a different format due to the weird way
 * Express sets options.
 * 
 * These options are set app-wide, unless otherwise stated.
 * 
 * For more documentation on Express settings, visit here:
 *      http://expressjs.com/en/api.html#app.settings.table
 */

// View engine to use.
// Do not change unless you're an advanced user and know what you're doing!
app.set('view engine', 'ejs');

// If true, URLs will be casse sensitive, causing /API and /api to be different
// All routes in Laaso are lowercase, so setting this to true will
// make it such that users much only use lowercase urls. Not recommended for good UX.
app.set('case sensitive routing', false);

// Proxies to trust.
// By default, Laaso will trust localhost, as many hosting it will have
// a web server proxying requests to Node, such as NginX.
// If you have an advanced setup where proxies may come from elsewhere,
// set the locations they'd arrive from here.
app.set('trust proxy', '127.0.0.1');

// Cloudflare
// Uncomment this if you are using Cloudflare to protect your Laaso instance.
// app.set('trust proxy', ['127.0.0.1','103.21.244.0/22', '102.22.200.0/22', '103.31.4.0/22', '104.16.0.0/22', '108.162.192.0/18', '131.0.72.0/22', '141.101.64.0/18', '162.158.0.0/15', '172.64.0.0/13', '173.245.48.0/20', '188.144.96.0/20', '190.93.240.0/20', '197.234.240.0/22', '198.41.128.0/17']);