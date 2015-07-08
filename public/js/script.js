
var currentDiv;

var currentFeed = 0;
var refreshTime = 6000;

var imgList = [];
var feedList = [
    'https://www.pinterest.com/benswinden/ᏞᏆnᎬ.rss',
    'https://www.pinterest.com/benswinden/ᎠᎡᎪᏇ.rss',
    'https://www.pinterest.com/benswinden/ᏚᏜᎷᏴᏫᏝ.rss',
    'https://www.pinterest.com/benswinden/ᎨℕᎢᎬᎡᎰᎪᏟᎬ.rss',
    'https://www.pinterest.com/benswinden/ᏢᎻᎤᎢᎾ.rss',
    'https://www.pinterest.com/benswinden/ᏚᏢᎪᏟᎬ.rss',
    'https://www.pinterest.com/benswinden/ᏆᎷᎪᏩᎬ.rss',
    'https://www.pinterest.com/benswinden/ᏨᏫᏞᎾᏬᏒ.rss',
    'https://www.pinterest.com/benswinden/ᏀᎡᎪᏢᎻᎨᏟ.rss',
    'https://www.pinterest.com/benswinden/ᎨᏞᏞᏌᏚᎢᎡᎪᎢᏋ.rss',
    'https://www.pinterest.com/benswinden/ᏟᏝᎧᎱᎻᏋᏚ.rss',
    'https://www.pinterest.com/benswinden/ᏀᏫᎾᎠᏕ.rss',
    'https://www.pinterest.com/benswinden/ᎢᎪᎢᎱᎤᏫ.rss',
    'https://www.pinterest.com/benswinden/ᎰᏝᏫᏒᎪ.rss',
    'https://www.pinterest.com/benswinden/ᎨᏞᏞᏌᏚᎢᎡᎪᎢᏋ.rss',
    'https://www.pinterest.com/benswinden/ᎷᏅᎢᎨᏫℕ.rss',
    'https://www.pinterest.com/benswinden/ᏢᎡᏆᏁᎢ.rss',
    'https://www.pinterest.com/benswinden/ᏖᎩᏢᎬ.rss',
    'https://www.pinterest.com/benswinden/ᎾᏴᎫᎬᏨᎱ.rss',
    'https://www.pinterest.com/benswinden/ᎻᏬᎷÅℕᏚ.rss'
]

google.load('feeds', '1');

$(document).ready(function(){

    // Loading gif ..
    $('#img1').html( '<img src="/images/load.gif" />' );

    sessionStorage.playing = 1;
    currentDiv = $('#img1');

    localStorage.removeItem('imgList');

    // sessionStorage.removeItem('imgList');
    if (!Cookies.get('dataValid') || !localStorage.getItem('imgList')) {

        getFeeds();
    }
     else {

        imgList = localStorage.imgList.split(',');
        setTimeout( initialize, 4000 ); // Set a timeout just so I can see that sweet gif
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
            getFeeds();
        }
        else {
            console.log(imgList.length);
            setTimeout( initialize, refreshTime );
        }
    }
}
