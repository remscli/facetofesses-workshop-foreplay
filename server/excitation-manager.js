const config = require('./config.json');
const five = require("johnny-five");
const ClientSocket = require("./client-socket");
const ServerSocket = require("./server-socket");

class ExcitationManager {
  constructor(params) {
    this.boards = params.boards;
    this.erogenousZones = params.erogenousZones;
    this.excitationRange = {min: 0, max: 100};
    this.currentExcitation = this.excitationRange.min;
    this.serverSocket = new ServerSocket();
    this.clientSocket = new ClientSocket();
    this.measureSensors();
    this.manageExcitation();
  }

  measureSensors() {
    this.erogenousZones.forEach((erogenousZone) => {
      erogenousZone.sensors.forEach((sensor) => {
        this.boards.each((board) => {
          if (board.id === erogenousZone.boardID) {
            board.analogRead(sensor.pin, (val) => {
              if (val > sensor.threshold) {
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
            this.currentExcitation += sensorTouchData.producedExcitation;
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
      if (this.currentExcitation >= this.excitationRange.max) {
        clearInterval(loop);
        this.end();
        return;
      }

      this.clientSocket.emit('update', {
        currentExcitation: this.currentExcitation,
        excitationRange: this.excitationRange
      });

      console.log(`EXCITATION : ${Math.round(this.currentExcitation)}   -   ` + debug);

      this.serverSocket.emit({type: 'update', excitation: Math.round(this.currentExcitation)});
    }
  }

  decreaseExcitation() {
    this.currentExcitation -= 2;
    if (this.currentExcitation < this.excitationRange.min) this.currentExcitation = this.excitationRange.min;
  }

  end() {
    console.log("WORKSHOP FINISHED");
  }
}

module.exports = ExcitationManager;