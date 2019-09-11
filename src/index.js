const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const publicDirectoryPath = path.join(__dirname, '../public');
const Filter = require('bad-words');
// setting up server 
const app = express();
const server = http.createServer(app);
const io = socketio(server)


app.use(express.static(publicDirectoryPath));

// connecting socketio
io.on('connection', (socket) => {
    console.log(`Connecting with websocket`);
    // setup  counting for accessing
    socket.emit('message', 'Welcome!');
    socket.broadcast.emit('message', 'A new user has joined chat!');

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();

        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed!');
        }
        io.emit('message', message);
        callback();
    });

    socket.on('sendLocation', (coords, callback) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longtitude}`);
        callback()
    });

    // disconnecting
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left this chat room!');
    });
});


// port
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening to port ${port}`));

