const App = require('../models/App');
const User = require('../models/User');

module.exports = {
    async hello(ws, msg) {
        try {
            if(msg.token === undefined) {
                ws.s({
                    err : 'No token provided'
                });

                return ws.terminate();
            }

            let app = await App.getByToken(msg.token);
            if(app === undefined) {
                ws.s({
                    err : 'Invalid token provided'
                });

                return ws.terminate();
            }

            // Auth was valid

            ws.token = msg.token;

            let response = {
                op : 'ready',
                app : app
            };

            ws.s(response);
        } catch(err) {
            console.log(err);
            ws.s({err:'Unknown error.'});
        }
    },

    async log(ws, msg) {
        try {
            if(msg.level === undefined) {msg.level = 'info';}
            if(msg.type === undefined) {
                return ws.s({
                    err : 'Event type not valid'
                });
            }

            let res = await ws.app.addLogEntry(msg.level, msg.type, msg.message);

            return ws.s({id:res});
        } catch(err) {
            if(err.code !== undefined && err.code === 'ER_DATA_TOO_LONG') {
                // SQL error, data is too long for a column.
                return ws.s({
                    err : 'Data too long',
                    msg : err.sqlMessage
                });
            }

            if(err.code !== undefined && err.code === 'NOT_JSON_OBJ') {
                // Message field was something other than a json object
                return ws.s({
                    err : 'Message is not a JSON object',
                    msg : err.message
                });
            }
            console.log(err);
            ws.s({err:'Unknown error.'});
        }
    }
};