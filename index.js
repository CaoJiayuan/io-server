const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', function(){ /* … */ });

app.get('/', function (req, res) {
    res.send('hello')
});

server.listen(3003);
