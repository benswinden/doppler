var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var path    = require("path");
var sqlite3 = require("sqlite3").verbose();
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

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

// Receives pinterest feed data from client function, checks against table data and enters entries that are new
app.post('/checkFeed',function(req,res){

    var table = req.body.table;
    var dataList = req.body.list;       // An array of objects : { img , link }



    var fs = require("fs");
    var file = "data/data.db";
    var exists = fs.existsSync(file);

    if(!exists) {
        console.log("Error : DB file is missing");
    }

    var db = new sqlite3.Database(file);

    db.serialize(function() {

        db.get("SELECT Count(*) as num FROM " + table, function(err, row) {

             console.log(row.num);
        });

        var i = 0;
        checkForEntry(db, table);
    });
});

function checkForEntry(db, table) {

    db.each(' SELECT * FROM ' + table + ' WHERE link LIKE "%' + dataList[i].link + '%" ' ,
        function item(err, row) {
            found = true;
        },
        function complete(err, found) {

            console.log(found + " " + temp);

            if (i < dataList.length) {
                i++;
                checkForEntry();
            }
            else {
                console.log("done");
            }
        }
    );
}

app.post('/test',function(req,res){

        var text = req.body.text;

    var fs = require("fs");
    var file = "data/data.db";
    var exists = fs.existsSync(file);

    if(!exists) {
        console.log("Error : DB file is missing");
    }

    var db = new sqlite3.Database(file);

    console.log("text:"+text);

    db.serialize(function() {

        db.each(' SELECT * FROM test WHERE field LIKE "%' + text  + '%" ' ,
            function item(err, row) {
                console.log("item");
            },
            function complete(err, found) {
                console.log("complete");
            }
        );
    });

});



var server = app.listen(6002, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('doppler listening at http://%s:%s', host, port);

});
