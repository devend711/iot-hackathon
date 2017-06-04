var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5000;

const bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));

// create application/json parser
const jsonParser = bodyParser.json();

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.render('pages/index');
});

app.get('/about', function (request, response) {
  response.render('pages/about');
});

app.post('/event', jsonParser, function (request, response) {
  console.log(request.body);
  io.emit('event', request.body);
  response.status(200);
  response.send('ping');
});

io.on('connection', function (socket) {
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('event', function (event) {
    console.log(event);
  });

  // Re-broadcastings
  socket.on('hero-update', function (hero) {
    socket.broadcast.emit('hero-update', hero);
  });

  socket.on('monster-update', function (monsterUpdate) {
    socket.broadcast.emit('monster-update', monsterUpdate);
  });

  socket.on('game-update', function (data) {
    socket.broadcast.emit('game-update', data);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
