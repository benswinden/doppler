var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var path    = require("path");
var sqlite3 = require("sqlite3").verbose();
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {

    console.log("Page loaded.");
    res.render('home');
});

app.post('/getTable',function(req,res){

    var table = req.body.table;

    var fs = require("fs");
    var file = "data/data.db";
    var exists = fs.existsSync(file);

    if(!exists) {
        console.log("Error : DB file is missing");
    }

    var db = new sqlite3.Database(file);

    var data = [];

    db.serialize(function() {

        var entryNum;

        // Get the total number of entries in the database
        db.get("SELECT Count(*) as num FROM " + table, function(err, row) {

            entryNum = row.num;
        });

        var index = 0;
        db.each("SELECT * FROM " + table, function(err, row) {

            index++;

            data.push ( '<a href="'+ row.link + '" target="_blank"><img src="'+ row.img + '" /></a>' );

            // Wait until all entries have been read before proceding
            if (index >= entryNum) {

                db.close();
                res.send(data);
            }
        });
    });
});








var server = app.listen(6002, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('doppler listening at http://%s:%s', host, port);

});
