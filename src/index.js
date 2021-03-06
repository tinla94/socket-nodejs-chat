const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const publicDirectoryPath = path.join(__dirname, '../public');
const Filter = require('bad-words');
// setting up server 
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const {
    generateMessage,
    generateLocation
} = require('./utils/messages');
const {
    addUser,
    removeUser,
    getUser,
    getAllUsers
} = require('./utils/users');


app.use(express.static(publicDirectoryPath));

// connecting socketio
io.on('connection', (socket) => {
    console.log(`Connecting with websocket`);


    // sending message within the room 
    socket.on('join', (options, callback) => {
        // adding user
        const { error, user } = addUser({ id: socket.id, ...options });

        // Validate user and room 
        if (error) {
            return callback(error);
        }
        socket.join(user.room); // joining room 
        socket.emit('message', generateMessage('Admin', `Welcome to room ${user.room}`));
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined the room!`));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getAllUsers(user.room)
        });
        callback();
    });

    // sending message
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter();

        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed!');
        }
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback();
    });

    socket.on('sendLocation', (coords, callback) => {        
        const user = getUser(socket.id)
        // send location
        io.to(user.room).emit('locationMessage', generateLocation(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longtitude}`));
        callback();
    });

    // disconnecting
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left the room!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getAllUsers(user.room)
            });
        };
    });
});


// port
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening to port ${port}`));

