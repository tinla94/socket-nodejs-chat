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
    socket.emit('countUpdated', count)
    socket.on('increment', () => {
        count++
        // socket.emit('countUpdated', count)
        io.emit('countUpdated', count)
    });
});
// port
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening to port ${port}`));

