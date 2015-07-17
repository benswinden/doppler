
var currentDiv;

var currentFeed = 0;
var refreshTime = 6000;
var tableGetComplete = 0;       // Number of tables that have been succesfuly retrieved

var imgList = [];
var tables = ['clothes', 'colour', 'draw', 'flora', 'goods', 'graphic', 'humans', 'illustrate', 'image', 'interface', 'line', 'machines', 'motion', 'object', 'photo', 'print', 'space', 'symbol', 'tattoo', 'type'];

google.load('feeds', '1');

$(document).ready(function(){

    // Loading gif ..
    $('#img1').html( '<img src="/images/load.gif" />' );

    sessionStorage.playing = 1;
    currentDiv = $('#img1');

    // localStorage.removeItem('imgList');

    // sessionStorage.removeItem('imgList');
    if (!Cookies.get('dataValid') || !localStorage.getItem('imgList')) {

        getTables();
    }
     else {

        imgList = localStorage.imgList.split(',');
        setTimeout( initialize, 3700 ); // Set a timeout just so I can see that sweet gif
    }

    // Key binds
    $(document).keyup(function( event ) {

        // Space
        if ( event.which == 32 ) {
            if (sessionStorage.playing == 1) {
                sessionStorage.playing = 0;
            }
            else {
                sessionStorage.playing = 1;
                initialize();
            }
        }
    });
});


function initialize() {

    if (sessionStorage.playing == 1) {

        var index = Math.floor(Math.random() * imgList.length);
        currentDiv.html( imgList[ index ]);

        // Remove the chose item from the list
        imgList.splice(index, 1);
        localStorage.setItem('imgList', imgList );

        if (currentDiv.selector == '#img1' ) {

            $('#img1').children().children().css('opacity', 1);
            $('#img2').children().children().css('opacity', 0);
            currentDiv = $('#img2')
        }
        else {
            $('#img1').children().children().css('opacity', 0);
            $('#img2').children().children().css('opacity', 1);
            currentDiv = $('#img1')
        }

        if (imgList.length == 0) {
            getTables();
        }
        else {
            console.log(imgList.length);
            setTimeout( initialize, refreshTime );
        }
    }
}

function getTables() {

    // Get each table data individually
    for (var i = 0; i < tables.length; i++) {

        getTable(tables[i]);
    }

    // Set a checker to tell when the tables have been gotten
    setTimeout( checkTableGetComplete, 1000 );
}

// Gets an html img string for each entry in a specified table
function getTable(table) {

    $.post("/getTable", {table : table} , function(data){

        // Callback
        if( data != null) {

            // Add all images received from server into the array that contains all images
            for (var i = 0; i < data.length; i++) {

                imgList.push(data[i]);
            }

            tableGetComplete++;
        }
    });
}

function checkTableGetComplete() {

    if (tableGetComplete == tables.length) {

        console.log("Starting..");

        // Save the new list to a cookie
        localStorage.setItem('imgList', imgList );
        Cookies.set('dataValid', 1, 1);     // Store a cookie so that we can set an expiration date after which we should reload data

        initialize();
    }
    else {

        setTimeout( checkTableGetComplete, 1000 );
    }
}






function getFeeds() {
    console.log("init: imglist length: " + imgList.length + "  currentFeed: " + currentFeed);

    if (currentFeed < feedList.length) {


        var feed = new google.feeds.Feed(feedList[currentFeed]); // update username

        feed.includeHistoricalEntries();
        feed.setNumEntries(25); // set number of results to show

        feed.load(function(result) {

            if (!result.error) {
                for (var i = 0; i < result.feed.entries.length; i++) { // loop through results
                    var entry   = result.feed.entries[i],
                    content = entry.content, // get "content" which includes img element
                    regex   = /src="(.*?)"/, // look for img element in content
                    src     = regex.exec(content)[1]; // pull the src out,

                    // put our link to the pin with img into our container:
                    var img = '<a href="'+ entry.link + '" target="_blank"><img src="'+ 'https://s-media-cache-ak0.pinimg.com/7' + src.substring(38, src.length) + '" /></a>';

                    imgList.push(img);
                }
            }

            currentFeed++;
            getFeeds();
        });
    }
    else {

        // Save the new list to a cookie
        localStorage.setItem('imgList', imgList );
        Cookies.set('dataValid', 1, 1);     // Store a cookie so that we can set an expiration date after which we should reload data

        initialize();
    }

}
