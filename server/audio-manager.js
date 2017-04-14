const fs = require('fs');
const lame = require('lame');
const Speaker = require('speaker');

let instance = null;

class AudioManager {
  constructor() {
    this.isPlaying = false;

    if(!instance){
      instance = this;
    }

    return instance;
  }

  play(filename) {
    this.isPlaying = true;
    let that = this;
    console.log("AUDIO PLAY");
    fs.createReadStream('./assets/audio/' + filename)
      .pipe(new lame.Decoder())
      .on('format', function (format) {
        let speaker = new Speaker(format);
        this.pipe(speaker);

        speaker.on('close', that.onClose.bind(that));
      });
  }

  onClose() {
    this.isPlaying = false;
    console.log("AUDIO END");
  }
}

module.exports = AudioManager;
