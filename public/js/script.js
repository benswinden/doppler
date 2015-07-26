
var currentDiv;

var currentFeed = 0;
var refreshTime = 6000;
var tableGetComplete = 0;       // Number of tables that have been succesfuly retrieved
var checkingFeeds = true;       // Whether or not the pinterest feeds should be checked for updated content

var imgList = [];
var tables = ['clothes', 'colour', 'draw', 'flora', 'goods', 'graphic', 'humans', 'illustrate', 'image', 'interface', 'line', 'machines', 'motion', 'object', 'photo', 'print', 'space', 'symbol', 'tattoo', 'type'];

var feeds = {
    'clothes' : 'https://www.pinterest.com/benswinden/ᏟᏝᎧᎱᎻᏋᏚ.rss',
    'colour' : 'https://www.pinterest.com/benswinden/ᏨᏫᏞᎾᏬᏒ.rss',
    'draw' : 'https://www.pinterest.com/benswinden/ᎠᎡᎪᏇ.rss',
    'flora' : 'https://www.pinterest.com/benswinden/ᎰᏝᏫᏒᎪ.rss',
    'goods' : 'https://www.pinterest.com/benswinden/ᏀᏫᎾᎠᏕ.rss',
    'graphic' : 'https://www.pinterest.com/benswinden/ᏀᎡᎪᏢᎻᎨᏟ.rss',
    'humans' : 'https://www.pinterest.com/benswinden/ᎻᏬᎷÅℕᏚ.rss',
    'illustrate' : 'https://www.pinterest.com/benswinden/ᎨᏞᏞᏌᏚᎢᎡᎪᎢᏋ.rss',
    'image' : 'https://www.pinterest.com/benswinden/ᏆᎷᎪᏩᎬ.rss',
    'interface' : 'https://www.pinterest.com/benswinden/ᎨℕᎢᎬᎡᎰᎪᏟᎬ.rss',
    'line' : 'https://www.pinterest.com/benswinden/ᏞᏆnᎬ.rss',
    'machines' : 'https://www.pinterest.com/benswinden/ᎷÅᏟᎻᎨℕᎬᏚ.rss',
    'motion' : 'https://www.pinterest.com/benswinden/ᎷᏅᎢᎨᏫℕ.rss',
    'object' : 'https://www.pinterest.com/benswinden/ᎾᏴᎫᎬᏨᎱ.rss',
    'photo' : 'https://www.pinterest.com/benswinden/ᏢᎻᎤᎢᎾ.rss',
    'print' : 'https://www.pinterest.com/benswinden/ᏢᎡᏆᏁᎢ.rss',
    'space' : 'https://www.pinterest.com/benswinden/ᏚᏢᎪᏟᎬ.rss',
    'symbol' : 'https://www.pinterest.com/benswinden/ᏚᏜᎷᏴᏫᏝ.rss',
    'tattoo' : 'https://www.pinterest.com/benswinden/ᎢᎪᎢᎱᎤᏫ.rss',
    'type' : 'https://www.pinterest.com/benswinden/ᏖᎩᏢᎬ.rss'
}


google.load('feeds', '1');

$(document).ready(function(){

    // Loading gif ..
    $('#img1').html( '<img src="/images/load.gif" />' );

    sessionStorage.playing = 1;
    currentDiv = $('#img1');

    // Remove Data
    // localStorage.removeItem('imgList');
    // sessionStorage.removeItem('imgList');

    checkFeeds();
    // test();

    // if (!Cookies.get('dataValid') || !localStorage.getItem('imgList')) {
    //
    //     getTables();
    // }
    //  else {
    //
    //     imgList = localStorage.imgList.split(',');
    //     setTimeout( initialize, 3700 ); // Set a timeout just so I can see that sweet gif
    // }

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

        if (checkingFeeds)
            checkFeeds();
        else
            initialize();
    }
    else {

        setTimeout( checkTableGetComplete, 1000 );
    }
}

// Retrieve all the newest content from pinterest feeds
function checkFeeds() {

    // Test
    checkFeed( tables[1] );
}

// Retrieve content from a pinterest feed, check against data in table for new entries
function checkFeed(table) {
    //console.log("init: imglist length: " + imgList.length + "  currentFeed: " + currentFeed);

    var feedURL = feeds[ table ]

    var feed = new google.feeds.Feed( feedURL ); // update username

    var list = [];

    feed.includeHistoricalEntries();
    feed.setNumEntries(25); // set number of results to show

    feed.load(function(result) {

        if (!result.error) {

            for (var i = 0; i < result.feed.entries.length; i++) { // loop through results
                var entry   = result.feed.entries[i],
                content = entry.content, // get "content" which includes img element
                regex   = /src="(.*?)"/, // look for img element in content

                src = regex.exec(content)[1]; // pull the src out,
                var image = 'https://s-media-cache-ak0.pinimg.com/7' + src.substring(38, src.length);
                var lnk = entry.link.substring(25, entry.link.length);

                var obj = {img : image, link : lnk};

                list.push(obj);
            }

            var data = {table : table, list : list };

            $.ajax({
                url: "/checkFeed",
                type: "POST",
                dataType: "xml/html/script/json", // expected format for response
                contentType: "application/json", // send as JSON
                data: JSON.stringify( data ) ,
            });
        }
        else
            console.log("Error from feed load");

        // currentFeed++;
        // getFeeds();
    });
}

function test() {

    var data = {text : 'testtext' };

    $.ajax({
        url: "/test",
        type: "POST",
        dataType: "xml/html/script/json", // expected format for response
        contentType: "application/json", // send as JSON
        data: JSON.stringify( data ) ,
    });
}
