const config = require('./config.json');
const five = require("johnny-five");

class ExcitationManager {
  constructor(params) {
    this.excitation = 0;
    this.boards = params.boards;
    this.erogenousZones = params.erogenousZones;
    this.excitationRange = {min: 0, max: 100};
    this.measureSensors();
    this.manageExcitation();
  }

  measureSensors() {
    this.erogenousZones.forEach((erogenousZone) => {
      erogenousZone.sensors.forEach((sensor) => {
        this.boards.each((board) => {
          if (board.id === erogenousZone.boardID) {
            board.analogRead(sensor.pin, (val) => {
              if (val > 800) {
                sensor.isTouched = true;
              }
            });
          }
        });
      });
    });
  }

  manageExcitation() {
    let loop = setInterval(checkSensors.bind(this), config.constants.UPDATE_INTERVAL);

    function checkSensors() {
      let touchedSensors = [];
      let debug = "";
      this.erogenousZones.forEach((erogenousZone) => {
        erogenousZone.sensors.forEach((sensor) => {
          if (sensor.isTouched) {
            let sensorTouchData = erogenousZone.touch(sensor);
            this.excitation += sensorTouchData.producedExcitation;
            touchedSensors.push(sensor);
            debug += "  TOUCHED   ";
          } else {
            debug += "            ";
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

      console.log(`EXCITATION : ${Math.round(this.excitation)}   -   ` + debug);
    }
  }

  decreaseExcitation() {
    this.excitation -= 2;
    if (this.excitation < this.excitationRange.min) this.excitation = this.excitationRange.min;
  }

  end() {
    console.log("WORKSHOP FINISHED");
  }
}

module.exports = ExcitationManager;