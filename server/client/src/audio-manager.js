var howler = require('howler');

var AudioManager = {
  isSpeaking: false,
  playing: false,
  howls: [],

  play: function (audio, params) {
    this.playing = true;
    this.playSound(audio, params);
  },

  playSound: function(audio, params) {
    console.log(audio.filename + ' -- rate :' + audio.rate() + ' | interval : ' + audio.interval());

    if (this.isSpeaking && audio.type == 'VOICE') return;

    if (audio.type === 'VOICE') {
      this.isSpeaking = true;
    }

    var howl = new howler.Howl({
      src: ['audio/' + audio.filename],
      volume: audio.volume,
      buffer: true,
      html5: true,
      onend: this.onEnd.bind(this, audio, params)
    });

    howl._sounds[0]._node.playbackRate = 10;

    howl.play();
    howl.rate(audio.rate());

    this.howls.push(howl);
  },

  onEnd: function (audio, params) {
    if (!this.playing) return;

    if (params && typeof params.onEnd === "function") params.onEnd();

    if (audio.type === 'VOICE') {
      this.isSpeaking = false;
    }

    if (audio.loop === true) {
      setTimeout(() => {
        this.playSound(audio);
      }, audio.interval() || 0);
    }
  },

  stopAll() {
    this.howls.forEach(function (howl) {
      howl.stop();
    });
    this.howls = [];
    this.isSpeaking = false;
    playing = false;
  }
};

module.exports = AudioManager;
