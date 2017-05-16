let instance = null;

class ServerSocket {
  constructor (sock) {
    if(!instance){
      this.isSpeaking = false;
      instance = this;
      this.sock = sock;
      this.init();
    }

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