const config = require('./config.json');
const ClientSocket = require("./client-socket");

class Sensor {
  constructor(params) {
    this.name = params.name;
    this.pin = params.pin;
    this.threshold = params.threshold;
    this.excitationPower = params.excitationPower;
    this.audio = params.audio;
    this.audioPlayed = false;
    this.isTouched = false;
    this.started = false;
  }

  stimulate() {
    this.isTouched = false;

    let clientSocket = new ClientSocket();

    if (this.audio && !this.audioPlayed && !clientSocket.isSpeaking) {
      console.log('PLAY', this.audio);
      clientSocket.emit('play', { filename: this.audio, type: 'VOICE' });
      this.audioPlayed = true;
    }

    // Divide sensor's excitation power following update interval
    return this.excitationPower / (1000 / config.constants.UPDATE_INTERVAL);
  }
}

module.exports = Sensor;