const socket = io();
socket.on('message', (message) => {
    console.log(message);
});



document.querySelector("#message-form").addEventListener('submit', (e) => {
    e.preventDefault();

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message)
});

document.querySelector('#send-location').addEventListener('click', (e) => {
    e.preventDefault();
    if(!navigator.geolocation) {
        return alert('This location is not supported by your browser!');
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longtitude: position.coords.longitude
        });
    });
});