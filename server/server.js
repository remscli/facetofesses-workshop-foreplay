'use strict';

const config = require('./config.json');
const five = require("johnny-five");
const boards = new five.Boards(config.boards, { timeout: 3600 });
// const socket = require('socket.io-client')('http://localhost:5300');
const ErogenousZone = require('./erogenous-zone');
const ExcitationManager = require('./excitation-manager');
const express = require('express');
const app = express();
const opn = require('opn');
const ClientSocket = require("./client-socket");
const server = require('http').Server(app);
const io = require('socket.io')(server);


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

// Open page in default browser
opn('http://localhost:' + config.constants.WEBPAGE_PORT);

let clientSocket = new ClientSocket(io);

// Arduino board is connected
boards.on("ready", function() {
  console.log("Boards are ready");

  let erogenousZones = config.erogenousZones.map((erogenousZone) => new ErogenousZone(erogenousZone));
  let excitationManager = new ExcitationManager({boards: this, erogenousZones: erogenousZones});


  // // WebSocket connection is open
  // socket.on('connect', () => {
  //   console.log("SOCKET CONNECTED");
  // });
  //
  // // WebSocket new event is received
  // socket.on('event', (data) => {
  //
  // });
  //
  // // WebSocket connection is close
  // socket.on('disconnect', () => {
  //   console.log("SOCKET DISCONNECTED");
  // });
});