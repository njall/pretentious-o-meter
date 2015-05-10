var country_code = ''
$( document ).ready(function(){

    $.getScript("share.min.js");
    set_country_code();
    amazonPrime();
    var name = getParameterByName('q');
    if (name != '') {
        runAll(name);
    }
    $('#comments').hide();
    $('#rating-type').bootstrapToggle({
            on: 'Percentage',
            off: 'Original',
            width: 120
     });
    $('#rating-type').change(function() {
        toggleRatings();
    })

    $('#submit').click(function(){
        var film_name = $('#name').val();
        runAll(film_name);
    }),
    $('#name').keyup(function() {
        var input = $(this).val();    
        if (input.length > 2){
            autocomplete(input)   
        } else {
            $('#name').autocomplete({source: []})
        }
    }),

    $(document).keypress(function(e){
        if(e.which == 13) {
            var film_name = $('#name').val();
            runAll(film_name, '');
        }
    }),
    $('[id*=ex]').click(function(){
      var film_name = $(this).val();
      runAll(film_name);
    })
});

function set_country_code() {
    $.ajax({ 
        url: '//freegeoip.net/json/', 
        dataType: 'jsonp',
        success: function(location) {
            var cc = location.country_code; 
            /*var cc = 'NL'*/
            $('#country_code').text(cc);
            country_code = cc;
        }
    })
}

function autocomplete(text) {
    var url = ["http://www.omdbapi.com/?",
               "s=", encodeURIComponent(text),
               '&type=movie',
                "&r=json"].join('');
    var res = jQuery.getJSON(url, function( data ){
        if (data.Search) {
            var names = []
            $.each(data.Search, function(i, v) {
                names.push({
                    label: v.Title + ' (' + v.Year + ')',
                    id: v.imdbID
                })
            }) 
            $('#name').autocomplete({
                source: names,
                select: function( event, ui ) {
                    runAll('', ui.item.id);
                }
            })
        }
    })
}

function toggleRatings() {
    $('#meta-original').toggle();
    $('#meta-percent').toggle();
    $('#rt-critic-rating-original').toggle();
    $('#rt-critic-rating-percent').toggle();
    $('#imdb-score-original').toggle();
    $('#imdb-score-percent').toggle();
    $('#rt-rating-original').toggle();
    $('#rt-rating-percent').toggle();
}

function setup_reddit(film_slug, social_desc) {
    var url = 'http://pretentious-o-meter.co.uk?q%3d' + encodeURIComponent(film_slug)
    var base_url = 'http://www.reddit.com/static'
    var widget = "<iframe src=\"" + base_url + "/button/button3.html?width=120&url=" + url
    widget += '&title=' + encodeURIComponent(social_desc)
    widget += '&sr=' + 'pretentiousometer'
    widget += '&newwindow=' + '1'
    /*var css =  'font-size:20px;cursor:pointer;width:60px;margin:0;padding:12px 0;text-align:center;float:left;height:22px;position:relative;z-index:2;-moz-box-sizing:content-box;box-sizing:content-box;';*/
    css = 'body { height:1000px } '
    widget += '&css=' + encodeURIComponent(css)
    widget += "\""
    widget += " frameBorder='0' style='width: 75px; height: 50px'>"
    $('#reddit-widget').html(widget);   
}

function iTunesProduct(film_slug) {
    $('#itunes-banner').hide();
    var url = 'http://itunes.apple.com/search?term=' + film_slug + ' &country='+ country_code + '&entity=movie'
    $.ajax({
        url: url,
        dataType: 'jsonp',
        success: function(data) { 
            if (data.resultCount && data.resultCount > 0) {
                var banner = '<iframe src="//banners.itunes.apple.com/banner.html?partnerId='
                banner += '&aId=1000l3vu'
                banner += '&bt=catalog'
                banner += '&t=catalog_white'
                banner += '&id=' + data.results[0].trackId 
                banner += '&c=' + country_code;
                banner += '&l=en-US'
                banner += '&w=728&h=90" frameborder=0 style="overflow-x:hidden;overflow-y:hidden;width:728px;height:90px;border:0px"></iframe>'
                $('#itunes-banner').show();
                $('#itunes-banner').html(banner)
            }
        }
    })
}

function amazonProduct(film_slug) {
    var banner = '<iframe src="'
        if ( country_code == 'GB' || country_code == 'IE'){
            var link = 'http://rcm-eu.amazon-adsystem.com/e/cm?t=pretenometer-21&o=2&p=48&l=st1&mode=dvd-uk' 
            link += '&search=' + film_slug
            link += '&fc1=000000&lt1=_blank&lc1=3366FF&bg1=FFFFFF&f=ifr'
        } else if (country_code == 'DE') {
            var link = "http://rcm-eu.amazon-adsystem.com/e/cm?t=pretenomete03-21&o=3&p=48&l=st1&mode=dvd-de"
            link += "&search=" + film_slug
            link += "&fc1=000000&lt1=_blank&lc1=3366FF&bg1=FFFFFF&f=ifr"
        } else if (country_code == 'FR') {
            var link = "http://rcm-eu.amazon-adsystem.com/e/cm?t=pretenomet0c3-21&o=8&p=48&l=st1&mode=dvd-fr&"
            link += "&search=" + film_slug
            link += "&fc1=000000&lt1=_blank&lc1=3366FF&bg1=FFFFFF&f=ifr"
        } else {
            var link = "http://rcm-na.amazon-adsystem.com/e/cm?t=pretenometer-20&o=1&p=48&l=st1&mode=dvd" 
            link += "&search= " + film_slug 
            link += "&fc1=000000&lt1=_blank&lc1=3366FF&bg1=FFFFFF&f=ifr"
        }
        banner += link + '" marginwidth="0" marginheight="0"width="728" height="90" border="0" frameborder="0" style="border:none;'
        banner += 'scrolling="no"></iframe>'
        $('#amazon-banner').html(banner);
}

function amazonPrime() {
        if ( country_code == 'GB' || country_code == 'IE'){
            $('#prime-banner').html('<iframe src="http://rcm-eu.amazon-adsystem.com/e/cm?t=pretenometer-21&o=2&p=48&l=ur1&category=piv&banner=1Y2RWQMYHB249C1M5FG2&f=ifr" width="728" height="90" scrolling="no" border="0" marginwidth="0" margin-left="40px" style="border:none;" frameborder="0"></iframe>')
        } else if (country_code == 'DE') {
            $('#prime-banner').html('<iframe src="http://rcm-eu.amazon-adsystem.com/e/cm?t=pretenomete03-21&o=3&p=48&l=ur1&category=de_piv&banner=00NJE46FJZ5AP106AQR2&f=ifr" width="728" height="90" scrolling="no" border="0" marginwidth="0" style="border:none;" frameborder="0"></iframe>')
        } else if (country_code == 'FR') {
            $('#prime-banner').html('<iframe src="http://rcm-eu.amazon-adsystem.com/e/cm?t=pretenomet0c3-21&o=8&p=48&l=ur1&category=premium&banner=0JSPDPB933M05T8J8XG2&f=ifr" width="728" height="90" scrolling="no" border="0" marginwidth="0" style="border:none;" frameborder="0"></iframe>')
        } else if (country_code == 'ES' || country_code == 'PT') {
                $('#prime-banner').html('<iframe src="http://rcm-eu.amazon-adsystem.com/e/cm?t=pretenomete0d-21&o=30&p=48&l=ur1&category=dvd&banner=1R9ZD165XRM3PQHSA5G2&f=ifr" width="728" height="90" scrolling="no" border="0" marginwidth="0" style="border:none;" frameborder="0"></iframe>')
        } else /*US*/ {
            $('#prime-banner').html('<iframe src="http://rcm-na.amazon-adsystem.com/e/cm?t=pretenometer-20&o=1&p=48&l=ur1&category=primemain&banner=1PREMK5A0BD4VB6F8Y02&f=ifr&linkID=VKRULXPP57R7RGMR" width="728" height="90" scrolling="no" border="0" marginwidth="0" style="border:none;" frameborder="0"></iframe>')
        }

}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function ChangeUrl(page, url) {
        if (typeof (history.pushState) != "undefined") {
            var obj = { Page: page, Url: '?q=' + url };
            history.pushState(obj, obj.Page, obj.Url);
        } else {
            console.log("Browser does not support HTML5.");
        }
    }

function runAll(film_name, id){
        $('#loader').show();  
        film_name = film_name.replace(/\ /g, '+');
        var url = ["http://www.omdbapi.com/?",
                   "&tomatoes=true",
                   '&type=movie',
                   "&r=json"].join('');
        if (film_name && film_name != '') {
            url = [url, '&t=', film_name].join('');
        }
        if (id && id != '') {
            url = [url, '&i=', id].join('');
        }
        var res = jQuery.getJSON(url, function( data ){
            if (data.Response === 'False'){
                $('#message').text(data.Error);
                $('#message').attr('text-color', 'red');
               setTimeout(function() {
                        $('#loader').hide();            
               }, 500); 
            } else {
                var film_slug = data.Title.replace(/\ /g, "+")
                ChangeUrl(film_slug, film_slug)
                    iTunesProduct(data.Title);
                    amazonProduct(data.Title);
                    amazonPrime();
                $('#film-info').show();
                $('#title').text(data.Title);
                $('#title').attr('href', 'http://www.imdb.com/title/' + data.imdbID)
                $('#title').attr('target', '_blank')
                $('#year').text(data.Year);

                $('#meta-original').text(data.Metascore + ' / 100').show();
                $('#meta-percent').text(data.Metascore + '%').hide();
                $('#rt-critic-rating-original').text(data.tomatoRating + ' / 10').show();
                $('#rt-critic-rating-percent').text(data.tomatoRating*10 + '%').hide();
                $('#imdb-score-original').text(data.imdbRating + ' / 10').show();
                $('#imdb-score-percent').text(data.imdbRating*10 + '%').hide();
                $('#rt-rating-original').text(data.tomatoUserRating + ' / 5').show();
                $('#rt-rating-percent').text(data.tomatoUserRating*20 + '%').hide();

                if ($('#rating-type').is(':checked')) {
                    toggleRatings();
                }

                /*$('#link-icon').show();
                $('#share-link').attr('href', 'http://pretentious-o-meter.co.uk?q=' + film_slug)
                $('#share-link').text('http://pretentious-o-meter.co.uk?q=' + film_slug)*/
                $('#poster').attr('src', 'http://img.omdbapi.com/?i=' + data.imdbID + '&apikey=8d8ace5a&h=275' );

                var include_rt = $('#rt').is(':checked');
                var include_imdb = $('#imdb').is(':checked');
                
                if (!(include_rt && data.tomatoUserRating && data.tomatoRating && data.tomatoRating != 'N/A')) {
                    include_rt = false;
                } 
                if (!(include_imdb && (data.Metascore && data.Metascore != 'N/A') && data.imdbRating)) {
                    include_imdb = false;
                }

                if (include_rt == true && include_imdb == true) {
                    var public_rating = ((data.imdbRating*10) + (data.tomatoUserRating*20))/2;
                    var critic_rating = (parseInt(data.Metascore) + parseInt(data.tomatoRating*10))/2;
                } else if (include_rt && !include_imdb) {
                    var critic_rating = data.tomatoRating*10;
                    var public_rating = data.tomatoUserRating*20;
                } else if (include_imdb) {
                    var critic_rating = data.Metascore;   
                    var public_rating = data.imdbRating*10;
                }

                if (critic_rating && public_rating){
                    var difference = public_rating - critic_rating;

/* Note:
Pretentious films over around 15/20 years are usually so because of a self-fulfilling proffesy.
More critics leave reviews for famous old films because of how popular they already are. They're
 far less likely to go slag off an old rubbish film but they will affirm a great one. 
As so I'm dampening the critic score of pretentious films by how old they are past 20 years. 
*/

                    var score = 0;
                    if (difference > 0){
                        var pretentious = false;
                        score = Math.pow((difference/5), 0.45)*50 /* Math.log(public_rating)*1.3*/;
                        
                    } else if (difference < 0) { /*on the pretencious spectrum */
                        var pretentious = true;
                        score = Math.pow((Math.abs(difference)/3.5), 0.45)*50 /* Math.log(public_rating)*1.3*/;
                    } else {
                        var pretentious = true;
                        score = 0
                    };

                    score = Math.min(score, 100);

                    var text = '';
                    switch(true){
                        case (pretentious && score >= 75):
                            text = 'Pop in your monocle squire, one finds it to be pretentious.'
                            break;
                        case (pretentious && score > 50 && score < 75):
                            text = 'Critics like this one a lot more than the audience does.';
                            break;
                        case( pretentious && score <= 50 && score > 25):
                            text = 'Probably a fairly original film.';
                            break;
                        case( pretentious && score <= 25):
                            text = 'The critics and the people have reached a consensus.';
                            break;
                            case( !pretentious && score <= 25):
                            text = 'The people and the critics have a consensus.';
                            break;
                        case( !pretentious && score <= 50 && score > 25):
                            text = 'Probably a touch predictable';
                            break;
                        case (!pretentious && score > 50 && score < 75):
                            text = 'The audience likes this one a lot more than critics do.';
                            break;
                        case (!pretentious && score >= 75):
                            text = 'Get on your dungarees, Ma. This ones made for the commoner.'
                            break;
                    };      

                    var bar_colour = 'blue';
                    var rating = (public_rating + critic_rating)/2
                    switch (true){
                        case (rating > 73):
                            bar_colour = 'green'
                            text = text + '... In general people like it';
                            break;
                        case (rating > 61 && rating <= 73):
                            bar_colour = 'orange'
                            text = text + '... In general people think it\'s alright.';
                            break;
                        case (rating <= 61):
                            bar_colour = 'red'
                            text = text + '... In general people don\'t like it';
                            break;
                    }


                    if (pretentious) {
                        $('#pretentious').attr('style', 'width: ' + score + '%; background-color:' + bar_colour);
                        $('#mass-market').attr('style', 'width: 0%; float: right; background-color:' + bar_colour);
                        $('#pret-val').text(Math.round(score) + '% Pretentious');
                        film_slug.replace("+", "%2B")
                        var twitter_desc = encodeURIComponent(data.Title) + ' is ' + Math.round(score) + 
                        '%25 pretentious on the Pretentious-O-Meter! %0Ahttp://pretentious-o-meter.co.uk?q=' + encodeURIComponent(film_slug)
                        var social_desc = data.Title + ' is ' + Math.round(score) + '% pretentious on the Pretentious-O-Meter!'
                    } else {
                        $('#mass-market').attr('style', 'width: ' + score + '%; float: right; background-color:' + bar_colour);
                        $('#pretentious').attr('style', 'width: 0%; background-color:' + bar_colour);
                        $('#pret-val').text(Math.round(score) + '% Mass Market');
                        var twitter_desc = encodeURIComponent(data.Title) + ' is ' + Math.round(score) + 
                        '%25 mass market on the Pretentious-O-Meter! %0Ahttp://pretentious-o-meter.co.uk?q=' + encodeURIComponent(film_slug)
                        var social_desc = data.Title + ' is ' + Math.round(score) + '% mass market on the Pretentious-O-Meter!'
                    }  

                    $('#message').text(text);
                    setTimeout(function() {
                        $('#loader').hide();            
                    }, 500); 
                   
                    $('#comments').show();
                    $('.comment-title').text(data.Title);
                    DISQUS.reset({
                        reload: true,
                        config: function () {  
                            this.page.identifier = film_slug,
                            this.page.title = data.Title,
                            this.page.url = 'http://pretentious-o-meter.co.uk?q=' + film_slug
                        }
                    });
                    
                    $('#sharing-button-text').show();
                    var share = new Share(".sharing-button", {
                        url: 'http://pretentious-o-meter.co.uk?q=' + film_slug,
                        description: social_desc,
                        title: social_desc,
                        image: 'http://pretentious-o-meter.co.uk/pretentiouscat1.gif',
                        ui: {
                            flyout: 'right',
                            button_text: 'Share Results'
                        },
                        networks: {
                            pinterest: {
                                enabled: false
                            },
                            facebook: {
                                caption: social_desc,
                                app_id: 287504138040462,
                                after: function() {
                                   this.toggle();
                                   this.toggle();
                                    $('.entypo-export').css('display', 'none');
                                }
                            },
                            twitter: {
                                description: twitter_desc,
                                url: '',
                                after: function() {
                                   this.toggle();
                                   this.toggle();
                                    $('.entypo-export').css('display', 'none');
                                }
                            },
                            google_plus: {
                                after: function() {
                                   this.toggle();
                                   this.toggle();
                                    $('.entypo-export').css('display', 'none');
                                }
                            },
                            email: {
                                after: function() {
                                   this.toggle();
                                   this.toggle();
                                    $('.entypo-export').css('display', 'none');
                                }
                            }
                        }
                    });
                    share.open();
                    $('.entypo-export').css('display', 'none');
                    $('meta[name="og:image"]').remove();
                    $('head').append('<meta name="og:image" content="http://img.omdbapi.com/?i=' + data.imdbID + '&apikey=8d8ace5a&h=275">')
                    setup_reddit(film_slug, social_desc);
               } else {
                    $('#message').text('Film doesn\'t have enough ratings, sorry.');
                    setTimeout(function() {
                        $('#loader').hide();            
                    }, 500); 
                };
                $('#name').val('');
            };
        });
}
