$( document ).ready(function(){
    $('#submit').click(function(){
        var film_name = $('#name').val();
        runAll(film_name);
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
                if (data.imdbRating && ((data.Metascore && data.Metascore != 'N/A') || data.tomatoMeter){
                    var difference = (data.imdbRating*10)-data.Metascore;
                    var score = 0;
                    if (difference > 0){
                        var pretentious = false;
                        score = difference * Math.log(data.imdbRating*10);
                        
                    } else { /*on the pretencious spectrum */
                        var pretentious = true;
                        console.log('difference: ' + difference);
                        score = difference * Math.log(data.Metascore*10);
                        
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
                    
                    if (data.imdbRating > 6.5) {
                        text = text + '... People really love it though';
                    } else {
                        text = text + '... But people really do not like it';
                    }
                    $('#message').text(text);
               } else {
                    $('#message').text('Film doesn\'t have enough ratings. It must suck.');

                };
            };
        });
            setTimeout(function() {
                $('#loader').hide();            
            }, 500); 
}