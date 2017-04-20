var socket = io('http://localhost:4501');

socket.on('play', function (data) {
  console.log(data);
});