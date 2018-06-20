const app = require('../controllers/express'); // Require the base app to get our Express app
const ewss = require('express-ws')(app);
const router = require('express').Router();
const wss = ewss.getWss('/');

const funcs = require('../controllers/websocket');
const App = require('../models/App');

// Time, in seconds, to wait between checking socket health
const TIMEOUT = 30;

router.ws('/', (ws, req) => { // eslint-disable-line no-unused-vars
    ws.on('message', async (msg) => {
        let jmsg;
        let op;

        // Validate the incoming data and respond with an error if it's malformed JSON
        try {
            jmsg = JSON.parse(msg);
        } catch(e) {
            ws.send(`{"error":"Invalid JSON","message":"${e}"}`);
            return;
        }

        // Ensure the data contains a valid opstring
        if(!jmsg.op || funcs[jmsg.op] === undefined) {
            ws.send('{"error":"Invalid opstring"}');
            return;
        }
        op = jmsg.op;

        // If the opstring isn't "hello", this needs to be authenticated.
        if(op !== 'hello') {
            if(ws.token === undefined) {
                return ws.s({
                    err : 'Not authenticated'
                });
            }

            let app;
            try {
                app = await App.getByToken(ws.token);
            } catch(err) {
                return ws.s({
                    err : 'Unknown error'
                });
            }

            if(app === undefined) {
                return ws.s({
                    err : 'App doesn\'t exist'
                });
            } else {
                ws.app = app;
            }
        }

        // Call the controller function responsible for this operation
        try {
            funcs[op](ws, jmsg);
        } catch(err) {
            return ws.s({
                err : 'Internal error'
            });
        }
    });
});


// Check for dead connections

wss.on('connection', (ws) => {
    // New connections are alive
    ws.isAlive = true;
    // Revive connections which respond to pings
    ws.on('pong',() => {ws.isAlive=true;});

    // Add a convenience method to send Objects as JSON
    ws.s = (object) => {
        ws.send(JSON.stringify(
            object
        ));
    };
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