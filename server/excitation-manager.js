const five = require("johnny-five");

class ExcitationManager {
  constructor(params) {
    this.excitation = 0;
    this.erogenousZones = params.erogenousZones;
    this.excitationRange = {min: 0, max: 100};
    this.measureSensors();
    this.manageExcitation();
  }

  measureSensors() {
    this.erogenousZones.forEach((erogenousZone) => {
      erogenousZone.sensors.forEach((sensor) => {
        let params = {
          pin: sensor.pin,
          freq: 10,
          threshold: 1
        };

        new five.Sensor(params).on("data", (value) => {
          if (value > 10) {
            // console.log(sensor.pin + " " + value);
            sensor.isTouched = true;
          }
        });
      });
    });
  }

  manageExcitation() {
    let loop = setInterval(checkSensors.bind(this), 500);

    function checkSensors() {
      let touchedSensors = [];
      this.erogenousZones.forEach((erogenousZone) => {
        erogenousZone.sensors.forEach((sensor) => {
          if (sensor.isTouched) {
            let sensorTouchData = erogenousZone.touch(sensor);
            this.excitation += sensorTouchData.producedExcitation;
            touchedSensors.push(sensor);
          }
        });
      });

      // Decrease excitation if there isn't any sensor touched
      if (touchedSensors.length == 0) this.decreaseExcitation();

      // Finish when excitation reach the maximum
      if (this.excitation >= this.excitationRange.max) {
        clearInterval(loop);
        this.end();
        return;
      }

      console.log(`EXCITATION : ${Math.round(this.excitation)}   -   ` + touchedSensors.map((sr) => `${sr.pin} TOUCHED`).join('  -   '));
    }
  }

  decreaseExcitation() {
    this.excitation -= 2;
    if (this.excitation < this.excitationRange.min) this.excitation = this.excitationRange.min
  }

  end() {
    console.log("WORKSHOP FINISHED");
  }
}

module.exports = ExcitationManager;