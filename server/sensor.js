const config = require('./config.json');
const ClientSocket = require("./client-socket");

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
    this.lastTouchDate = Date.now();

    if (this.audio && !this.audioPlayed) {
      new ClientSocket().emit('play', { filename: this.audio, type: 'VOICE' });
      this.audioPlayed = true;
    }

    // Divide sensor's excitation power by two because it's called twice per second
    return this.excitationPower / (1000 / config.constants.UPDATE_INTERVAL);
  }
}

module.exports = Sensor;