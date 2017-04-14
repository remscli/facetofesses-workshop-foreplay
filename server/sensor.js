const config = require('./config.json');
const AudioManager = require('./audio-manager');

class Sensor {
  constructor(params) {
    this.name = params.name;
    this.pin = params.pin;
    this.excitationPower = params.excitationPower;
    this.audio = params.audio;
    this.lastTouchDate = null;
    this.audioPlayed = false;
  }

  stimulate() {
    if (this.audio && !this.audioPlayed) {
      let audioManager = new AudioManager();
      if (!audioManager.isPlaying) {
        audioManager.play(this.audio);
        this.audioPlayed = true;
      }
    }

    this.lastTouchDate = Date.now();

    // Divide sensor's excitation power by two because it's called twice per second
    return this.excitationPower / (1000 / config.constants.UPDATE_INTERVAL);
  }
}

module.exports = Sensor;