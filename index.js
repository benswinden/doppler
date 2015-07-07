var express = require('express');
var exphbs  = require('express-handlebars');
var path    = require("path");
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
    res.render('home');
});


var server = app.listen(6002, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('signil listening at http://%s:%s', host, port);

});
