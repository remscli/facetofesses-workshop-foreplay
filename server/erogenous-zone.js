const Sensor = require('./sensor');
const REGENERATION_TIME = 10000; // Time necessary for a erogenous zone to become erogenous back

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
    // Calculate excitation produced
    let producedExcitation = this.getProducedExcitation(sensor);

    if (producedExcitation) {
      this.lastTouchDate = Date.now();
      this.givenExcitation += producedExcitation;
    }

    sensor.isTouched = false;
    sensor.lastTouchDate = Date.now();

    console.log(producedExcitation);
    return {producedExcitation: producedExcitation};
  }

  getProducedExcitation(sensor) {
    let producedExcitation = sensor.excitationPower / 2;

    console.log(this.givenExcitation + producedExcitation);
    console.log(this.availableExcitation);
    // Ensure that given excitation doesn't exceed available excitation
    if (this.givenExcitation + producedExcitation >= this.availableExcitation) {
      
      // Allow excitation to be given with this erogenous zone if it hasn't been touched for more that regeneration time
      console.log(`Time : ${Date.now() - this.lastTouchDate}`);
      if (Date.now() - this.lastTouchDate > REGENERATION_TIME) {
        this.givenExcitation = this.availableExcitation * 0.666;
      } else {
        return 0;
      }
    }
    
    return producedExcitation;
  }
}

module.exports = ErogenousZone;
