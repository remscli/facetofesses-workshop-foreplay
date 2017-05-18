var socket = require('socket.io-client')('http://localhost:4501');
var Audio = require('./audio');
var AudioManager = require('./audio-manager');
var RangeScaler = require('./range-scaler');
var config = require('../../config.json');
var heartbeatConfig = {
  interval: {min: 700, max: 200},
  rate: {min: 1, max: 1.3}
};

var App = {
  firstTouchPlayed: false,

  init: function() {
    this.playedAudios = [];
    this.initSocketsEvents();
  },

  initSocketsEvents: function () {
    socket.on('connect', this.onStart.bind(this));
    socket.on('update', this.onUpdate.bind(this));
    socket.on('play', this.onPlay.bind(this));
    socket.on('disconnect', this.onDisconnect.bind(this));
  },

  onStart: function () {
    console.log("START");

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
    var voiceIntro = new Audio({
      filename: config.audios.intro,
      type: 'VOICE'
    });
    AudioManager.play(voiceIntro);
    this.playedAudios[voiceIntro.filename] = voiceIntro;
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

    // FIRST TOUCH
    if (!this.firstTouchPlayed && data.currentExcitation > 5 && !AudioManager.isSpeaking) {
      var voiceFirstTouch = new Audio({
        filename: config.audios.firstTouch,
        type: 'VOICE'
      });
      AudioManager.play(voiceFirstTouch);
      this.playedAudios[voiceFirstTouch.filename] = voiceFirstTouch;
      this.firstTouchPlayed = true;
    }
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
    this.firstTouchPlayed = false;
  }
};

App.init();