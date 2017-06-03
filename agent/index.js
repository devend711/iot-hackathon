var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.post('/', function(request, response) {
  console.log('ping:', request.data);
  response.status(200);
  response.send('ping');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


