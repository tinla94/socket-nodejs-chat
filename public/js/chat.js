const socket = io();

// Element
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');


// Templates
const messasgeTemplate = document.querySelector('#message-template').innerHTML;

socket.on("message", message => {
  console.log(message);
  const html = Mustache.render(messasgeTemplate, {
    message
  })
  $messages.insertAdjacentHTML('beforeend', html)
});

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
