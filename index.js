"use strict";
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
require('dotenv').load();
let HttpSubscriber = require('./subscriber/HttpSubscriber');


io.on('connection', function (client) { /* … */

});

app.post('/subscribe', function (req, res) {
    res.send('hello')
});


server.listen(3003, () => console.info('Server on'));
