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

            data.push ( '<a href="https://www.pinterest.com'+ row.link + '" target="_blank"><img src="'+ row.img + '" />asdasdasd</a>' );

            // Wait until all entries have been read before proceding
            if (index >= entryNum) {

                db.close();
                res.send(data);
            }
        });
    });
});

// Receives pinterest feed data from client function, checks against table data and enters entries that are new
var i = 0;
var newEntriesFound = 0;
app.post('/checkFeed',function(req,res){

    var table = req.body.table;
    var dataList = req.body.list;       // An array of objects : { img , link }

    i = 0;
    newEntriesFound = 0;
    console.log("Check Table: " + table + " begin");
    checkForEntry(table, dataList);

    res.send(undefined);
});

function checkForEntry(table, dataList) {

    var fs = require("fs");
    var file = "data/data.db";
    var exists = fs.existsSync(file);

    if(!exists) {
        console.log("Error : DB file is missing");
    }

    var db = new sqlite3.Database(file);

    db.serialize(function() {

        db.each(' SELECT * FROM ' + table + ' WHERE link LIKE "%' + dataList[i].link + '%" ' ,
            function item(err, row) {
                found = true;
            },
            function complete(err, found) {

                // Enter into db
                if (found == 0) {

                    newEntriesFound++;

                    var link = "'" + dataList[i].link + "'";
                    var img = "'" + dataList[i].img + "'";

                    var stmt = "INSERT INTO " + table + " ('link','img') VALUES (" + link + "," + img +") ";
                    db.run(stmt);
                }

                if (i < dataList.length - 1) {
                    i++;
                    checkForEntry(table, dataList);
                }
                else {
                    console.log("Check Table: " + table + " complete. New entries found: " + newEntriesFound);
                }
            }
        );
    });
}


var server = app.listen(6002, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('doppler listening at http://%s:%s', host, port);

});
