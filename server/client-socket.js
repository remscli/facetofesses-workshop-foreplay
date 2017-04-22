let instance = null;

class ClientSocket {
  constructor (io) {
    if(!instance){
      instance = this;
      this.io = io;
      this.init();
    }

    return instance;
  }

  init () {
    this.io.on('connection', (socket) => {
      console.log("CLIENT SOCKET CONNECTED");
      this.socket = socket;

      // FOR DEV ONLY - REMOVE IT WHEN ARDUINO CARD IS CONNECTED
      this.socket.emit('ready');
    });
  }

  emit (type, data) {
    if (!this.socket) return;

    this.socket.emit(type, data);
  }
}

module.exports = ClientSocket;