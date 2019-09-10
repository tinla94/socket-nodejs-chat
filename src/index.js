const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const publicDirectoryPath = path.join(__dirname, '../public');
// setting up server 
const app = express();
const server = http.createServer(app);
const io = socketio(server)


app.use(express.static(publicDirectoryPath));

let count = 0;
// connecting socketio
io.on('connection', (socket) => {
    console.log(`Connecting with websocket`);
    // setup  counting for accessing
    socket.emit('message', 'Welcome!');
    socket.broadcast.emit('message', 'A new user has joined chat!');
    socket.on('sendMessage', (message) => {
        io.emit('message', message);
    });

    socket.on('sendLocation', (coords) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longtitude}`)
    });

    // disconnecting
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left this chat room!');
    });
});


// port
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening to port ${port}`));

