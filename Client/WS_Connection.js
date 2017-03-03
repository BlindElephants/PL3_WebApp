//------WebSocket

//Can resolve hostname to IP
//Instantiating this instance should automatically attempt to open the connection
var socket = new WebSocket("ws://BlindElephants.local:8080", "echo-protocol");

console.log("ready state: ");
console.log(socket.readyState);

function doOnOpen(event) {
  console.log("Connection opened");
  console.log("ready state: ");
  console.log(socket.readyState);
}

function objectAdded(thisObject) {
  var msg = {
    address: "/client/object/added",
    args: [thisObject.position.x, thisObject.position.y]
  }
  socket.send(JSON.stringify(msg));
}

function objectMoved(thisObject, previousPosition) {
  var msg = {
    address: "/client/object/moved",
    args: [previousPosition.x, previousPosition.y, thisObject.position.x, thisObject.position.y]
  }
  socket.send(JSON.stringify(msg));
}

function objectRemoved(thisObject) {
  var msg = {
    address: "/client/object/removed",
    args: [thisObject.position.x, thisObject.position.y]
  }
  socket.send(JSON.stringify(msg));
}


function doOnMessage(event) {
  // console.log(event.data);
  //----this is where calls should be made based on received messages from the server

  //This is a complete message. There's no parsing or conversion included for Stringified JSON files
  //Send a string "add" to trigger this response, otherwise, nothing.

  // if(event.data === "add") {
  // }

  var msg = JSON.parse(event.data);
  // console.log(msg);


  /*
    This sends a response that contains the positions of every object currently on the client's screen
  */
  if(msg.address === "/get/objects") {
    var response = {
      address: "/client/objects",
      args: []
    }
    for(var i = 0 ; i < objects.children.length ; i ++ ) {
      response.args.push(objects.children[i].position);
    }
    socket.send(JSON.stringify(response));
  }

  if(msg.address === "/instruction/add") {

  }

  if(msg.address === "/instruction/move") {

  }

  if(msg.address === "/instruction/remove") {

  }

  if(msg.address === "/client_message/") {
    // console.log(msg);
  // } else if(msg.address === "/geom/add/") {
    // console.log("adding geometry");
    // var cubeGeometry = new THREE.CubeGeometry(50, 100, 10);
    // var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x1ec876});
    // var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    // cube.rotation.y = Math.PI * 45/180;

    // cube.position.x = (msg.args[2]-0.5) * window.innerWidth;
    // cube.position.y = (msg.args[3]-0.5) * window.innerHeight;
    // cube.position.z = 0.0;
    // cube.isDrawing = false;
    // cube.delayDrawing = (msg.args[5]);
    // cube.drawingDuration = (msg.args[4]);

    // var thisSize = 80;
    // var circ = new THREE.CircleGeometry(12, 64);
    // var m = new THREE.MeshBasicMaterial({color:0x000000});
    // var c = new THREE.Mesh(circ, m);
    // c.position.x = (msg.args[2]-0.5)*window.innerWidth;
    // c.position.y = (msg.args[3]-0.5)*window.innerHeight;
    // c.position.z = 0.0;
    // c.isDrawing = false;
    // c.delayDrawing = (msg.args[5]);
    // c.drawingDuration = (msg.args[4]);
    // c.drawingTime = (msg.args[4]);
    // c.scaleStep = 1.0 / c.drawingDuration;
    // // scene.add(cube);
    // SceneGeom.push(c);
    // // SceneGeom.push(cube);
  }
}

//This shouldn't be needed, but will be called if there are errors
function doOnError(event) {
  console.log("ERROR: " + event.data);
}


//When connection is closed
function doOnClose(event) {
  console.log("Connection CLOSED");
}

window.addEventListener("load", function(event) {
  socket.addEventListener("open", doOnOpen);
  socket.addEventListener("message", doOnMessage);
  socket.addEventListener("error", doOnError);
  socket.addEventListener("close", doOnClose);
});
/*
  this provides a periodic (every 2000 milliseconds) check for open connection to server
  As long as the connection is open, nothing happens.
  If the connection closes, Client attempts to reconnect.
  Requires that listeners are first removed, and then socket is reinstantiated, initializing another connection attempt
*/

var connectionCheck = setInterval(function() {
  if(socket.readyState === 1) {
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
