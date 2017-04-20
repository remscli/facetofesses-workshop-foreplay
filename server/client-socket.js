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
      this.socket = socket;
      this.socket.emit('play', { hello: 'world' });
    });
  }
}

module.exports = ClientSocket;