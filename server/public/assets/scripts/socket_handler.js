$(function () {
  var socket = io();
  socket.on('event', function (event) {
    console.log('received event', event);
  });
});