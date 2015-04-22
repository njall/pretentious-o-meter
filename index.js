$( document ).ready(function(){

    var name = getParameterByName('q');
    if (name != '') {
        runAll(name);
    }

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
    $('[id*=ex]').click(function(){
      var film_name = $(this).val();
      runAll(film_name);
    })
});

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
            } else {
                $('#film-info').show();
                $('#title').text(data.Title);
                $('#year').text(data.Year);
                $('#meta').text(data.Metascore + ' / 100');
                $('#imdb-score').text(data.imdbRating + ' / 10');
                $('#tomatometer').text(data.tomatoMeter + ' / 100');
                $('#rt-rating').text(data.tomatoUserRating + ' / 5');
                $('#link-icon').show();
                $('#share-link').text('http://pretentious-o-meter.co.uk?q=' + film_name)
                if (data.Poster != 'N/A') {
                $('#poster').attr('src', data.Poster); }


                var include_rt = $('#rt').is(':checked');
                var include_imdb = $('#imdb').is(':checked');
                
                if (!(include_rt && data.tomatoUserRating && data.tomatoMeter && data.tomatoMeter != 'N/A')) {
                    include_rt = false;
                } 
                if (!(include_imdb && (data.Metascore && data.Metascore != 'N/A') && data.imdbRating)) {
                    include_imdb = false;
                }

                if (include_rt == true && include_imdb == true) {
                    console.log('here');
                    var public_rating = ((data.imdbRating*10) + (data.tomatoUserRating*20))/2;
                    var critic_rating = (parseInt(data.Metascore) + parseInt(data.tomatoMeter))/2;
                } else if (include_rt && !include_imdb) {
                    var critic_rating = data.tomatoMeter;
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
                        
                    } else { /*on the pretencious spectrum */
                        var pretentious = true;
                        score = Math.pow((Math.abs(difference)/5), 0.45)*50 /* Math.log(public_rating)*1.3*/;
                    };
                    score = Math.min(score, 100);

                    

                    if (pretentious) {
                        $('#pretentious').attr('style', 'width: ' + score + '%');
                        $('#mass-market').attr('style', 'width: 0%; float: right;');
                        $('#pret-val').text(Math.round(score) + '% Pretentious');
                    } else {
                        $('#mass-market').attr('style', 'width: ' + score + '%; float: right;');
                        $('#pretentious').attr('style', 'width: 0%;');
                        $('#pret-val').text(Math.round(score) + '% Mass Market');
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
               } else {
                    $('#message').text('Film doesn\'t have enough ratings, sorry.');
                    setTimeout(function() {
                        $('#loader').hide();            
                    }, 500); 

                };
            };
        });
}
