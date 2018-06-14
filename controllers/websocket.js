module.exports = {
    async hello(ws, msg) {
        // NOTE: When the auth system works, authenticate the socket connection
        // rather than just cheekily greeting the client.
        ws.send('{"message":"Hi!"}');
    }
};