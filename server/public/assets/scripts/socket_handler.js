$(function () {
  var socket = io();
  socket.emit('event', {data: 'hi'});
  socket.on('event', function (event) {
    console.log('event!', event);
  });
});