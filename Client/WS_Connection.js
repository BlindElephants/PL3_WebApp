//------WebSocket

//Can resolve hostname to IP
var socket = new WebSocket("ws://BlindElephants.local:8080", "echo-protocol");

console.log("ready state: ");
console.log(socket.readyState);

function doOnOpen(event) {
  console.log("Connection opened");
  console.log("ready state: ");
  console.log(socket.readyState);
}

function doOnMessage(event) {
  console.log(event.data);
  //----this is where calls should be made based on received messages from the server

  //This is a complete message. There's no parsing or conversion included for Stringified JSON files
  //Send a string "add" to trigger this response, otherwise, nothing.

  // if(event.data === "add") {
  // }
}

function doOnError(event) {
  console.log("ERROR: " + event.data);
}

function doOnClose(event) {
  console.log("Connection CLOSED");
}

window.addEventListener("load", function(event) {
  socket.addEventListener("open", doOnOpen);
  socket.addEventListener("message", doOnMessage);
  socket.addEventListener("error", doOnError);
  socket.addEventListener("close", doOnClose);
});




var connectionCheck = setInterval(function() {
  if(socket.readyState === 1) {
    // console.log("connection is locked");
    // socket.send("test text");
    return;
  } else {
    socket.close();
    socket.removeEventListener("open", doOnOpen);
    socket.removeEventListener("message", doOnMessage);
    socket.removeEventListener("error", doOnError);
    socket.removeEventListener("close", doOnClose);

    console.log("Trying again");
    socket = new WebSocket("ws://BlindElephants.local:8080", "echo-protocol");

    socket.addEventListener("open", doOnOpen);
    socket.addEventListener("message", doOnMessage);
    socket.addEventListener("error", doOnError);
    socket.addEventListener("close", doOnClose);
  }
}, 2000);
