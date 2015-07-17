var express = require('express');
var exphbs  = require('express-handlebars');
var path    = require("path");
var app = express();

var tables = ['clothes', 'colour', 'draw', 'flora', 'goods', 'graphic', 'humans', 'illustrate', 'image', 'interface', 'line', 'machines', 'motion', 'object', 'photo', 'print', 'space', 'symbol', 'tattoo', 'type'];

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
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
        db.get("SELECT Count(*) as num FROM " +  + " entries", function(err, row) {

            entryNum = row.num;
        });

        var index = 0;
        db.each("SELECT * FROM entries", function(err, row) {

            index++;

                // Grab the project and check whether it has been stored already
            if (row.project != '') {

                var found = false;

                if (dbData.projects.length == 0)
                dbData.projects[0] = row.project;

                for (var i = 0; i < dbData.projects.length; i++) {

                    if (dbData.projects[i] == row.project) {
                        found = true;
                        break;
                    }
                }

                if (!found) {

                    dbData.projects.push(row.project);
                }
            }

                // Grab the tag and check whether it has been stored already

            // Split the tag string coming from the database since it contains many tags
            var tagList = row.tags.split(',');

            // Iterate through each tag found in the DB
            for (var tagListIndex = 0; tagListIndex < tagList.length; tagListIndex++) {

                if (tagList[tagListIndex] != '') {

                    var found = false;

                    if (dbData.tag.length == 0)
                    dbData.tag[0] = tagList[tagListIndex];

                    // Check against all tags already found and listed
                    for (var storedTagListIndex = 0; storedTagListIndex < dbData.tag.length; storedTagListIndex++) {

                        if (dbData.tag[storedTagListIndex] == tagList[tagListIndex]) {
                            found = true;
                            break;
                        }
                    }

                    if (!found) {

                        dbData.tag.push(tagList[tagListIndex]);
                    }
                }
            }

            // Wait until all entries have been read before proceding
            if (index >= entryNum) {

                db.close();
                res.send(dbData);
            }
        });
    });
});








var server = app.listen(6002, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('doppler listening at http://%s:%s', host, port);

});
