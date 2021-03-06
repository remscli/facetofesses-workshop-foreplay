var socket = require('socket.io-client')('http://localhost:4501');
var Audio = require('./audio');
var AudioManager = require('./audio-manager');
var RangeScaler = require('./range-scaler');
var config = require('../../config.json');
var heartbeatConfig = {
  interval: {min: 700, max: 200},
  rate: {min: 1, max: 1.3}
};

let ENV;

var App = {
  init: function() {
    this.playedAudios = [];
    this.initSocketsEvents();
  },

  initSocketsEvents: function () {
    socket.on('init', this.onStart.bind(this));
    socket.on('update', this.onUpdate.bind(this));
    socket.on('play', this.onPlay.bind(this));
    socket.on('disconnect', this.onDisconnect.bind(this));
  },

  onStart: function (data) {
    console.log("START");
    ENV = data.ENV;

    // AMBIENT
    this.ambient = new Audio({
      filename: config.audios.ambient,
      loop: true
    });
    AudioManager.play(this.ambient);
    this.playedAudios[config.audios.ambient] = this.ambient;

    // HEARTBEAT
    this.heartbeat = new Audio({
      filename: config.audios.heartbeat,
      loop: true,
      interval: heartbeatConfig.interval.min,
      rate: heartbeatConfig.rate.min,
      volume: 0.3,
    });
    AudioManager.play(this.heartbeat);
    this.playedAudios[config.audios.heartbeat] = this.heartbeat;

    // INTRODUCTION
    if (ENV === 'production') {
      var voiceIntro = new Audio({
        filename: config.audios.intro,
        type: 'VOICE'
      });
      AudioManager.play(voiceIntro, {
        onEnd: function () {
          socket.emit('start');
        }
      });
      this.playedAudios[voiceIntro.filename] = voiceIntro;
    } else {
      socket.emit('start');
    }
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
  },


  onDisconnect: function () {
    console.log("DISCONNECTED");
    AudioManager.stopAll();
    this.playedAudios = [];
  }
};

App.init();