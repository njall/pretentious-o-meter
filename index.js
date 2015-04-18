$( document ).ready(function(){
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
    $('#ex1').click(function(){
        var film_name = $('#ex1').val();
        runAll(film_name);
    }),
    $('#ex2').click(function(){
        var film_name = $('#ex2').val();
        runAll(film_name);
    }),
    $('#ex3').click(function(){
        var film_name = $('#ex3').val();
        runAll(film_name);
    }),
    $('#ex4').click(function(){
        var film_name = $('#ex4').val();
        runAll(film_name);
    }),
    $('#ex5').click(function(){
        var film_name = $('#ex5').val();
        runAll(film_name);
    }),
    $('#ex6').click(function(){
        var film_name = $('#ex6').val();
        runAll(film_name);
    }),
    $('#ex7').click(function(){
        var film_name = $('#ex7').val();
        runAll(film_name);
    }),
    $('#ex8').click(function(){
        var film_name = $('#ex8').val();
        runAll(film_name);
    }),
    $('#ex9').click(function(){
        var film_name = $('#ex9').val();
        runAll(film_name);
    }),
    $('#ex10').click(function(){
        var film_name = $('#ex10').val();
        runAll(film_name);
    }),
    $('#ex11').click(function(){
        var film_name = $('#ex11').val();
        runAll(film_name);
    })
});

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
                $('#meta').text(data.Metascore);
                $('#imdb-score').text(data.imdbRating);
                $('#tomatometer').text(data.tomatoMeter);
                $('#rt-rating').text(data.tomatoRating);
                if (data.Poster != 'N/A') {
                $('#poster').attr('src', data.Poster); }


                var include_rt = $('#rt').is(':checked');
                var include_imdb = $('#imdb').is(':checked');
                
                if (!(include_rt && data.tomatoRating && data.tomatoMeter)) {
                    include_rt = false;
                } 
                if (!(include_imdb && (data.Metascore && data.Metascore != 'N/A') && data.imdbRating)) {
                    include_imdb = false;
                }

                if (include_rt == true && include_imdb == true) {
                    console.log('here');
                    var public_rating = ((data.imdbRating*10) + (data.tomatoRating*10))/2;
                    var critic_rating = (parseInt(data.Metascore) + parseInt(data.tomatoMeter))/2;
                } else if (include_rt && !include_imdb) {
                    var critic_rating = data.tomatoMeter;
                    var public_rating = data.tomatoRating*10;
                } else if (include_imdb) {
                    var critic_rating = data.Metascore;   
                    var public_rating = data.imdbRating*10;
                }

                if (critic_rating && public_rating){
                    var difference = public_rating - critic_rating;

                    var score = 0;
                    if (difference > 0){
                        var pretentious = false;
                        score = difference * Math.log(public_rating)*1.3;
                        
                    } else { /*on the pretencious spectrum */
                        var pretentious = true;
                        console.log('difference: ' + difference);
                        score = difference * Math.log(critic_rating)*1.3;
                        
                        console.log('score: ' + score);
                    };
                    var score = 50 - score/2;
                    score = Math.min(score, 100);
                    score = Math.max(score, 0);
                    $('#pret-val').text(Math.round(score) + '%');

                    $('.progress-bar').attr('style', 'width: ' + score + '%');
                    var text = '';
                    switch(true){
                        case (score >= 75):
                            text = 'Get on your monocle squire, we have a pretentious one.'
                            break;
                        case (score > 50 && score < 75):
                            text = 'Probably a fairly original film that is also entertaining.';
                            break;
                        case( score <= 50 && score > 25):
                            text = 'Made for the masses.';
                            break;
                        case( score <= 25):
                            text = 'Unoriginal, slapstick, or mainstream.';
                            break;
                    };      
                    
                    if (public_rating > 65) {
                        text = text + '... In general people like it';
                    } else {
                        text = text + '... In general people don\'t like it';
                    }
                    $('#message').text(text);
               } else {
                    $('#message').text('Film doesn\'t have enough ratings, sorry.');

                };
            };
        });
            setTimeout(function() {
                $('#loader').hide();            
            }, 500); 
}