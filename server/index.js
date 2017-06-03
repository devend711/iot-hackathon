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
    console.log('event');
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
