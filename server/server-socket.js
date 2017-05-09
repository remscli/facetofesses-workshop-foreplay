let instance = null;

class ServerSocket {
  constructor (sock) {
    if(!instance){
      instance = this;
      this.sock = sock;
      this.init();
    }

    this.isSpeaking = false;

    return instance;
  }

  init () {
    this.sock.onopen = () => {
      this.emit({type: 'auth', device: 'preliminaire'});
    };
  }

  emit (data) {
    this.sock.send(JSON.stringify(data));
  }
}

module.exports = ServerSocket;