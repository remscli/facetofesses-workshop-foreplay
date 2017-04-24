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
    });
  }

  emit (type, data) {
    if (!this.socket) return;

    this.socket.emit(type, data);
  }
}

module.exports = ClientSocket;