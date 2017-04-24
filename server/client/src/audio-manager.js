var howler = require('howler');

var AudioManager = {
  isSpeaking: false,

  play: function (audio) {
    console.log('rate :' + audio.rate() + ' | interval : ' + audio.interval());

    if (this.isSpeaking && audio.type == 'VOICE') return;

    if (audio.type === 'VOICE') this.isSpeaking = true;

    var howl = new howler.Howl({
      src: ['audio/' + audio.filename],
      buffer: true,
      html5: true,
      onend: this.onEnd.bind(this, audio)
    });

    howl._sounds[0]._node.playbackRate = 10;

    howl.play();
    howl.rate(audio.rate());
  },

  onEnd: function (audio) {
    if (audio.type === 'VOICE') this.isSpeaking = false;

    if (audio.loop === true) {
      setTimeout(() => {
        this.play(audio);
      }, audio.interval() || 0);
    }
  }
};

module.exports = AudioManager;
