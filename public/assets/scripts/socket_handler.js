window.$(function () {
  var socket = io();

  socket.on('event', function (event){
    $('#messages').append($('<li>').text(event.data));
  });
});
