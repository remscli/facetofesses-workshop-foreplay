let instance = null;

class ClientSocket {
  constructor (io, params) {
    if (!instance) {
      instance = this;
      this.io = io;
      this.init();
      this.isSpeaking = false;
      this.onStartCallbaks = [];
    }

    if (params && params.onStart) instance.onStartCallbaks.push(params.onStart);

    return instance;
  }

  init () {
    this.io.on('connection', (socket) => {
      console.log("CLIENT SOCKET CONNECTED");
      this.socket = socket;

      this.socket.on('start', this.onStart.bind(this));
      this.socket.on('playEnd', this.onPlayEnd.bind(this));
    });
  }

  emit (type, data) {
    if (!this.socket) return;

    if (data.type == 'VOICE') this.isSpeaking = true;

    this.socket.emit(type, data);
  }

  onStart () {
    this.onStartCallbaks.forEach((onStartCallback) => {
      onStartCallback();
    });
  }

  onPlayEnd (data) {
    if (data.type == 'VOICE') {
      this.isSpeaking = false;
    }
  }
}

module.exports = ClientSocket;