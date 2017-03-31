'use strict';

const config = require('./config.json');
const five = require("johnny-five");
const boards = new five.Boards(config.boards, { timeout: 3600 });
// const socket = require('socket.io-client')('http://localhost:5300');
const ErogenousZone = require('./erogenous-zone');
const ExcitationManager = require('./excitation-manager');

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