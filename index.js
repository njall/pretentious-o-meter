$( document ).ready(function(){

    $.getScript("share.min.js");

    var name = getParameterByName('q');
    if (name != '') {
        runAll(name);
    }
    $('#comments').hide();

    $('#submit').click(function(){
        var film_name = $('#name').val();
        runAll(film_name);
    }),
    $(document).keypress(function(e){
        if(e.which == 13) {
            var film_name = $('#name').val();
            runAll(film_name);
        }
    }),
    $('#reddit-upvote').click(function() {
        var no_submit = is_on_reddit();
        if (no_submit == false) {
            upvote();
        } else {
            submit_to_reddit();
            upvote();
        }
    }),
    $('#reddit-downvote').click(function() {
        var no_submit = is_on_reddit();
        if  (no_submit) {
            downvote();
        } else {
            submit_to_reddit();
            downvote();
        }
    }),
    $('[id*=ex]').click(function(){
      var film_name = $(this).val();
      runAll(film_name);
    })
});

function is_on_reddit(){
    return true;
}
function downvote(){
    alert('downvoted');
}
function upvote(){
    alert('upvoted');
}
function submit_to_reddit(){
    var res = jQuery.getJSON('http://www.reddit.com/api/me.json', function( data ){
        console.log(data);
        console.log(data.modhash);
    });
 /*   $.ajax({
        type: "POST",
        url: url,
        data: {
            api_type: 'json',
            captcha: 'todo',
            resubmit: 'false',
            sr: 'pretentiousometer',
            then: 'tb',
            kind: 'link',
            title: 'Film Name',
            url: 'http://pretentious-o-meter.co.uk'
        },
        success: success,
        dataType: dataType
    });*/
    alert('submitted to reddit');

}
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
    
function runAll(film_name){
        $('#loader').show();  
        film_name = film_name.replace(/\ /g, '+');
        var url = ["http://www.omdbapi.com/?",
                   "t=", film_name,
                   "&y=",
                   "&tomatoes=true",
                   "&plot=short",
                   "&r=json"].join('');
        var res = jQuery.getJSON(url, function( data ){
            console.log(data);
            if (data.Response === 'False'){
                $('#message').text(data.Error);
                $('#message').attr('text-color', 'red');
               setTimeout(function() {
                        $('#loader').hide();            
               }, 500); 
            } else {
                var film_slug = data.Title.replace(/\ /g, "+")
                $('#film-info').show();
                $('#title').text(data.Title);
                $('#title').attr('href', 'http://www.imdb.com/title/' + data.imdbID)
                $('#title').attr('target', '_blank')
                $('#year').text(data.Year);
                $('#meta').text(data.Metascore + ' / 100');
                $('#imdb-score').text(data.imdbRating + ' / 10');
                $('#rt-critic-rating').text(data.tomatoRating + ' / 10');
                $('#rt-rating').text(data.tomatoUserRating + ' / 5');
                $('#link-icon').show();
                $('#share-link').attr('href', 'http://pretentious-o-meter.co.uk?q=' + film_slug)
                $('#share-link').text('http://pretentious-o-meter.co.uk?q=' + film_slug)
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
                    console.log('here');
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

/*Better formula...
=0.5 +/- [(|diff|/maxdiff)^0.5]/2
where + sign if critics higher or - sign of public
maxdiff should be the biggest possible difference which is technically 9, but will likely be much lower, maybe set to 3/4/5*/

                    var score = 0;
                    if (difference > 0){
                        var pretentious = false;
                        score = Math.pow((difference/5), 0.45)*50 /* Math.log(public_rating)*1.3*/;
                        
                    } else if (difference < 0) { /*on the pretencious spectrum */
                        var pretentious = true;
                        score = Math.pow((Math.abs(difference)/3), 0.45)*50 /* Math.log(public_rating)*1.3*/;
                    } else {
                        var pretentious = true;
                        score = 0
                    };

                    score = Math.min(score, 100);

                    

                    if (pretentious) {
                        $('#pretentious').attr('style', 'width: ' + score + '%');
                        $('#mass-market').attr('style', 'width: 0%; float: right;');
                        $('#pret-val').text(Math.round(score) + '% Pretentious');
                        film_slug.replace("+", "%2B")
                        var twitter_desc = encodeURIComponent(data.Title) + ' is ' + Math.round(score) + 
                        '%25 pretentious on the Pretentious-O-Meter! %0Ahttp://pretentious-o-meter.co.uk?q=' + encodeURIComponent(film_slug)
                        var social_desc = data.Title + ' is ' + Math.round(score) + '% pretentious on the Pretentious-O-Meter!'
                    } else {
                        $('#mass-market').attr('style', 'width: ' + score + '%; float: right;');
                        $('#pretentious').attr('style', 'width: 0%;');
                        $('#pret-val').text(Math.round(score) + '% Mass Market');
                        var twitter_desc = encodeURIComponent(data.Title) + ' is ' + Math.round(score) + 
                        '%25 mass market on the Pretentious-O-Meter! %0Ahttp://pretentious-o-meter.co.uk?q=' + encodeURIComponent(film_slug)
                        var social_desc = data.Title + ' is ' + Math.round(score) + '% mass market on the Pretentious-O-Meter!'
                    }  

                    var text = '';
                    switch(true){
                        case (pretentious && score >= 75):
                            text = 'Pop in your monocle squire, we have ourselves a pretentious one.'
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
                    
                    if (public_rating > 65) {
                        text = text + '... In general people like it';
                    } else {
                        text = text + '... In general people don\'t like it';
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
                    
               } else {
                    $('#message').text('Film doesn\'t have enough ratings, sorry.');
                    setTimeout(function() {
                        $('#loader').hide();            
                    }, 500); 
                };
            };
        });
}
