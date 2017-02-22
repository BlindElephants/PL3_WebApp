//npm install osc
const osc = require("osc");

//npm install websocket
const WebSocketServer = require("websocket").server;
const http = require('http');
const dns = require('dns');

var clients = [];

// UDP / OSC
var getIPAddresses = function() {
  var os = require("os");
  var interfaces = os.networkInterfaces();
  var ipAddresses = [];

  for(var deviceName in interfaces) {
    var addresses = interfaces[deviceName];
    for(var i = 0 ; i < addresses.length ; i ++ ) {
      var addressInfo = addresses[i];
      if(addressInfo.family === "IPv4" && !addressInfo.internal) {
        ipAddresses.push(addressInfo.address);
      }
    }
  }
  return ipAddresses;
}

var udpPort = new osc.UDPPort({
  //this sets up the receive port
  localAddress: "0.0.0.0",
  localPort: 57121,

  //this sets up the send port
  remoteAddress: "127.0.0.1",
  remotePort: 57120
});

udpPort.on("ready", function() {
  var ipAddresses = getIPAddresses();
  console.log("Listening for OSC over UDP.");
  ipAddresses.forEach(function(address) {
    console.log(" Host: ", address + ", Port:", udpPort.options.localPort);
  });

  udpPort.send({
        address: "/test_message/",
        args: ["default", 100]
    }, "localhost", 57120);
});

//this is what happens if udp receives a message (anything with an appropriate OSC-formatted address)
udpPort.on("message", function(oscMessage) {
  // console.log(oscMessage);

  // console.log("message recv'd");
  // console.log(oscMessage);

  if(oscMessage.address === '/client_message/') {
    console.log("found client message");
    console.log(oscMessage);
    for(var i = clients.length-1 ; i >= 0 ; i -- ) {
      if(clients[i].remoteAddress === oscMessage.args[0]) {
        clients[i].sendUTF(JSON.stringify(oscMessage));
      }
    }
  }

  if(oscMessage.address === '/user/get_all/') {
    console.log("backend requesting all users");
    var msg = {
      address: "/user/existing/",
      args: []
    };
    if(clients.length > 0) {
      for(var i = 0 ; i < clients.length ; i++ ) {
        msg.args.push(clients[i].remoteAddress);
      }
    }
    udpPort.send(msg, "localhost", 57120);
  }
});

udpPort.on("error", function(err) {
  console.log(err);
});

//open udp connection
udpPort.open();



//WebSocketServer

var server = http.createServer(function(request, response) {
  console.log((new Date()) + 'Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(8080, function() {
  console.log(('url: ' + server.url));
  console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  //There should be some qualification here to approve of attempted connections
  //Right now it will accept every attempt
  return true;
}

wsServer.on('request', function(request) {
  if(!originIsAllowed(request.origin)) {
    request.reject();
    console.log((new Date()) + + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  var connection = request.accept('echo-protocol', request.origin);

  udpPort.send({
    address: "/user/add/",
    args: [connection.remoteAddress]
  }, "localhost", 57120);


  clients.push(connection);
  console.log("number of clients: " + clients.length);

  connection.on('message', function(message) {
    if(message.type === 'utf8') {

      if(message.utf8Data === "") {
        // udpPort.send({
        //       address: "/test_message/",
        //       args: ["default", 100]
        //   }, "localhost", 57120);
      }


      // var msg = {
      //   address: "/test/message",
      //   args: ["this is a test message", Math.random(), Math.random(), "4th argument test string"]
      // };
      // udpPort.send(msg);
    } else if(message.type === 'binary') {
      console.log('Received Binary Message: ' + message.binaryData.length + ' bytes');
      // connection.sendBytes(message.binaryData);
    }
  });

  connection.on('close', function(reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');

    udpPort.send({
      address: "/user/remove/",
      args: [connection.remoteAddress]
    }, "localhost", 57120);

    for(var i = clients.length-1 ; i >= 0 ; i -- ) {

      if(clients[i].remoteAddress === connection.remoteAddress) {
        clients.splice(i, 1);
      }
        //
        // if(clients[i].clientNumber == connection.clientNumber) {
        //    clients.splice(i, 1);
        // }
    }
    console.log("client removed, new size: " + clients.length);
  });
  // console.log(connection);
  console.log(WebSocketServer.clients);
});

//Send a ping to clients.
//Can console.log() this on the client side to verify connection.
// var pingClient = setInterval(function() {
//   for(var i = clients.length-1 ;i >= 0 ; i -- ) {
//     clients[i].sendUTF("ping client");
//   }
// }, 1000);


//This is the message that generates new geometry on the client side
// var addClient = setInterval(function() {
//   for(var i = clients.length-1 ; i >= 0 ; i -- ) {
//     if((Math.random()*100)<=5) clients[i].sendUTF("add");
//   }
// }, 100);
