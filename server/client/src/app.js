var socket = require('socket.io-client')('http://localhost:4501');
var Audio = require('./audio');
var AudioManager = require('./audio-manager');
var heartbeatFilename = 'heartbeat.mp3';

var App = {
  init: function() {
    this.playedAudios = [];
    this.initSocketsEvents();
  },

  initSocketsEvents: function () {
    socket.on('ready', this.onReady.bind(this));
    socket.on('update', this.onUpdate.bind(this));
    socket.on('play', this.onPlay.bind(this));
  },

  onReady: function () {
    this.heartbeat = new Audio({
      filename: heartbeatFilename,
      loop: true,
      interval: 700,
      rate: 1
    });
    AudioManager.play(this.heartbeat);
    this.playedAudios[heartbeatFilename] = this.heartbeat;
    console.log(this);
  },

  onUpdate: function (data) {
    console.log(data);

    var newRate = this.heartbeat.rate() + 0.1;
    newRate = newRate <= 1.5 ? newRate : 1.5;
    this.heartbeat.rate(newRate);

    var newInterval = this.heartbeat.interval() - 100;
    newInterval = newInterval >= 200 ? newInterval : 200;
    this.heartbeat.interval(newInterval);
  },

  onPlay: function () {

  }

};

App.init();