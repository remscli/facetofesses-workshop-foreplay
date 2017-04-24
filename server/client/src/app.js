var socket = require('socket.io-client')('http://localhost:4501');
var Audio = require('./audio');
var AudioManager = require('./audio-manager');
var RangeScaler = require('./range-scaler');
var heartbeatFilename = 'heartbeat.mp3';
var heartbeatConfig = {
  interval: {min: 700, max: 200},
  rate: {min: 1, max: 1.3}
};

var App = {
  init: function() {
    this.playedAudios = [];
    this.initSocketsEvents();
    this.start();
  },

  initSocketsEvents: function () {
    socket.on('update', this.onUpdate.bind(this));
    socket.on('play', this.onPlay.bind(this));
  },

  start: function () {
    this.heartbeat = new Audio({
      filename: heartbeatFilename,
      loop: true,
      interval: heartbeatConfig.interval.min,
      rate: heartbeatConfig.rate.min
    });
    AudioManager.play(this.heartbeat);
    this.playedAudios[heartbeatFilename] = this.heartbeat;
    console.log(this);
  },

  onUpdate: function (data) {
    var newRate = new RangeScaler({
      value: data.currentExcitation,
      range: data.excitationRange
    }).scaleTo(heartbeatConfig.rate.min, heartbeatConfig.rate.max);
    this.heartbeat.rate(newRate);

    var newInterval = new RangeScaler({
      value: data.currentExcitation,
      range: data.excitationRange
    }).scaleTo(heartbeatConfig.interval.min, heartbeatConfig.interval.max);
    this.heartbeat.interval(newInterval);
  },

  onPlay: function (params) {
    console.log("PLAY", params);
    var audio = new Audio(params);
    AudioManager.play(audio, {
      onEnd: function () {
        socket.emit('playEnd', params);
      }
    });
    this.playedAudios[audio.filename] = audio;
  }
};

App.init();