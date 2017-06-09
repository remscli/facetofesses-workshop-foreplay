'use strict';

console.log("Starting app in " + process.env.NODE_ENV + " environment");

const config = require('./config.json');
const five = require("johnny-five");
const SockJS = require('sockjs-client');
const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const opn = require('opn');
const ClientSocket = require("./client-socket");
const ServerSocket = require("./server-socket");
const ErogenousZone = require('./erogenous-zone');
const ExcitationManager = require('./excitation-manager');

let app = express();
let server = http.Server(app);

// Static files
app.use(express.static('client'));

// Browser route
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/app.html');
});

// Start Express app
server.listen(config.constants.WEBPAGE_PORT + 1);
app.listen(config.constants.WEBPAGE_PORT, () => {
  console.log('Listening on port ' + config.constants.WEBPAGE_PORT);
});

let boards = new five.Boards(config.boards, { timeout: 3600 });

// When Arduino board is connected
boards.on("ready", function() {
  console.log("Boards are ready");

  // Client socket
  let io = SocketIO(server);
  let clientSocket = new ClientSocket(io);

  // Server socket
  let sock = new SockJS('http://localhost:8080/ws');
  let serverSocket = new ServerSocket(sock);

  // Open page in default browser
  // opn('http://localhost:' + config.constants.WEBPAGE_PORT);

  // Erogenous zones management
  let erogenousZones = config.erogenousZones.map((erogenousZone) => new ErogenousZone(erogenousZone));
  let excitationManager = new ExcitationManager({boards: this, erogenousZones: erogenousZones});
});
