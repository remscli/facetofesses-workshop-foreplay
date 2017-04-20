var AudioManager = {
  isPlaying: false,

  play: function (params) {
    this.isPlaying = true;
    console.log("AUDIO PLAY");
    fs.createReadStream('./assets/audio/' + params.filename)
      .pipe(new lame.Decoder())
      .pipe(new Speaker())
      .on('close', this.onClose.bind(this, params));
  },

  onClose: function (params) {
    this.isPlaying = false;
    console.log("AUDIO END");

    if (params.loop === true) {
      setTimeout(() => {
        this.play(params);
      }, params.interval || 0);
    }
  }
};