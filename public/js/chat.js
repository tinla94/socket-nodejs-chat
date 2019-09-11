const socket = io();


// Element
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');


// Templates
const messasgeTemplate = document.querySelector('#message-template').innerHTML;
const locationmessageTemplate = document.querySelector('#location-message-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

// join room 
socket.on("join", ({ username, room }) => {
  console.log(username, room);
  socket.join(room); // emitting event

  // setting up message sending for specific room 
  io.to.emit

})

// sending out messages
socket.on("message", message => {
  console.log(message);
  const html = Mustache.render(messasgeTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  });
  $messages.insertAdjacentHTML('beforeend', html)
});

// sending out location
socket.on("locationMessage", (mapUrl) => {
    console.log(mapUrl);
    const html  = Mustache.render(locationmessageTemplate, {
        mapUrl: mapUrl.url,
        createdAt: moment(mapUrl.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

// form submit for messages
$messageForm.addEventListener("submit", e => {
  e.preventDefault();

  // disable button
  $messageFormButton.setAttribute('disabled', 'disabled');

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (error) => {
      // remove disabled
      $messageFormButton.removeAttribute('disabled');
      $messageFormInput.value = ''
      $messageFormInput.focus()
      if(error) console.log(error);
      console.log('Message is sent!');
  });
});

// button to send out location
$sendLocationButton.addEventListener("click", e => {   
  e.preventDefault();
  if (!navigator.geolocation) {
    return alert("This location is not supported by your browser!");
  }
  // disable button after pressing it
    $sendLocationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit("sendLocation", {
      latitude: position.coords.latitude,
      longtitude: position.coords.longitude
    }, () => {
        console.log('Location shared!')
        // after location is sent
        $sendLocationButton.removeAttribute('disabled');
    });
  });
});


// joinning rooms with username and room 
socket.emit('join', { username, room })