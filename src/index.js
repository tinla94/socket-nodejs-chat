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

// connecting socketio
io.on('connection', () => {
    console.log('New webscoket connection!')
})
// port
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening to port ${port}`));

