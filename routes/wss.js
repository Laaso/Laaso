const app = require('../controllers/express'); // Require the base app to get our Express app
const ewss = require('express-ws')(app);
const router = require('express').Router();
const wss = ewss.getWss('/');

const funcs = require('../controllers/websocket');

// Time, in seconds, to wait between checking socket health
const TIMEOUT = 30;

router.ws('/', (ws, req) => { // eslint-disable-line no-unused-vars
    ws.on('message', (msg) => {
        let jmsg;
        let op;

        // Validate the incoming data and respond with an error if it's malformed JSON
        try {
            jmsg = JSON.parse(msg);
        } catch(e) {
            ws.send(`{"error":"Invalid JSON.","message":"${e}"}`);
            return;
        }

        // Ensure the data contains a valid opstring
        if(!jmsg.op || funcs[jmsg.op] === undefined) {
            ws.send('{"error":"Invalid opstring."}');
            return;
        }
        op = jmsg.op;

        // Call the controller function responsible for this operation
        funcs[op](ws, jmsg);
    });
});


// Check for dead connections

wss.on('connection', (ws) => {
    // New connections are alive
    ws.isAlive = true;
    // Revive connections which respond to pings
    ws.on('pong',() => {ws.isAlive=true;});
});

setInterval(() => {
    wss.clients.forEach((client) => {
        // The client did not respond to the last ping. Assume they're dead
        if(client.isAlive === false) {return client.terminate();}

        // Upon response to the ping, this is flipped back to true
        client.isAlive = false;
        client.ping();
    });
}, TIMEOUT*1000);

module.exports = router;