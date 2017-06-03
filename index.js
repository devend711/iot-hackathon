var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// create application/json parser
var jsonParser = bodyParser.json()

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.post('/', jsonParser, function(request, response) {
  console.log(request.body);
  response.status(200);
  response.send('ping');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


