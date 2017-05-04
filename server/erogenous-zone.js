const Sensor = require('./sensor');
const config = require('./config.json');

class ErogenousZone {
  constructor(params) {
    this.name = params.name;
    this.port = params.port;
    this.availableExcitation = params.availableExcitation;
    this.boardID = params.boardID;
    this.givenExcitation = 0;
    this.sensors = params.sensors.map((sensor) => new Sensor(sensor));
    this.isTouched = false;
    this.lastTouchDate = null;
  }

  touch(sensor) {
    let producedExcitation = this.getProducedExcitation(sensor);

    if (producedExcitation) {
      this.lastTouchDate = Date.now();
      this.givenExcitation += producedExcitation;
    }

    sensor.isTouched = false;
    sensor.lastTouchDate = Date.now();

    return {producedExcitation: producedExcitation || 0};
  }

  getProducedExcitation(sensor) {
    let producedExcitation = sensor.stimulate();

    if (this.isExcitable(producedExcitation)) {
      return producedExcitation;
    } else {
      if (this.isRegenerable()) {
        this.givenExcitation = this.availableExcitation * 0.666;
      } else {
        return 0;
      }
    }
  }

  isExcitable(producedExcitation) {
    return this.givenExcitation + producedExcitation <= this.availableExcitation;
  }

  isRegenerable() {
    return Date.now() - this.lastTouchDate > config.constants.REGENERATION_TIME;
  }
}

module.exports = ErogenousZone;
