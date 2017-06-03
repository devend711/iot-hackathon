const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const io = require('socket.io')(http);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// create application/json parser
const jsonParser = bodyParser.json();

let gameState = {

}

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.render('pages/index');
});

app.post('/event', jsonParser, function (request, response) {
  console.log(request.body);
  socket.emit('event', request.body);
  response.status(200);
  response.send('ping');
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

