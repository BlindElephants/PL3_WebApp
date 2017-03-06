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
    for(var i = 0 ; i < objectsGroup.children.length ; i ++ ) {
      response.args.push(objectsGroup.children[i].position);
    }
    socket.send(JSON.stringify(response));
  }

  if(msg.address === "/get/dimensions") {
    var response = {
      address: "/client/dimensions",
      args: [window.innerWidth, window.innerHeight]
    }
    socket.send(JSON.stringify(response));
  }

  if(msg.address === "/instruction/add") {
    let o = new THREE.Mesh(new THREE.RingGeometry((objectSize*0.5*1.2)-2, objectSize*0.5*1.2, 32, 8), new THREE.MeshBasicMaterial( {color: 0x000000} ));
    o.position.set(msg.args[0], msg.args[1], 0);
    o.drawingDuration = msg.args[2];
    o.drawingTime     = msg.args[2];
    o.drawingDelay    = msg.args[3];
    o.instrType       = "ADD";
    o.isDrawing       = false;
    instructions.push(o);
  }

  if(msg.address === "/instruction/move") {
    let g = new THREE.Geometry();

    g.vertices.push(
      new THREE.Vector3(msg.args[0], msg.args[1], 0),
      new THREE.Vector3(msg.args[2], msg.args[3], 0)
    );

    //need to do some fancier curving and geometry creation here

    let o = new THREE.Line(g, new THREE.MeshBasicMaterial({color:0x000000}));
    o.drawingDuration = msg.args[4];
    o.drawingTime     = msg.args[4];
    o.drawingDelay    = msg.args[5];
    o.instrType       = "MOVE";
    o.isDrawing       = false;
    instructions.push(o);
  }

  if(msg.address === "/instruction/remove") {
    let o = new THREE.Mesh(new THREE.RingGeometry((objectSize*0.5*1.2)-2, objectSize*0.5*1.2, 32, 8), new THREE.MeshBasicMaterial( {color: 0x000000}));
    o.position.set(msg.args[0], msg.args[1], 0);
    o.drawingDuration = msg.args[2];
    o.drawingTime     = msg.args[2];
    o.drawingDelay    = msg.args[3];
    o.instrType       = "REMOVE";
    o.isDrawing       = false;
    instructions.push(o);
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
