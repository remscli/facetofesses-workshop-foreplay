class Sensor {
  constructor(params) {
    this.name = params.name;
    this.pin = params.pin;
    this.excitationPower = params.excitationPower;
    this.lastTouchDate = null;
  }
}

module.exports = Sensor;