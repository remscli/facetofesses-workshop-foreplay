let instance = null;

class ClientSocket {
  constructor (io) {
    if(!instance){
      instance = this;
      this.io = io;
      this.init();
    }

    this.isSpeaking = false;

    return instance;
  }

  init () {
    this.io.on('connection', (socket) => {
      console.log("CLIENT SOCKET CONNECTED");
      this.socket = socket;

      this.socket.on('playEnd', this.onPlayEnd.bind(this));
    });
  }

  emit (type, data) {
    if (!this.socket) return;

    if (data.type == 'VOICE') this.isSpeaking = true;

    this.socket.emit(type, data);
  }

  onPlayEnd (data) {
    if (data.type == 'VOICE') {
      this.isSpeaking = false;
    }
  }
}

module.exports = ClientSocket;