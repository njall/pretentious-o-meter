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
    })
});

function runAll(film_name){
        $('#loader').show();
        film_name = film_name.replace(/\ /g, '+');
        var url = ["http://www.omdbapi.com/?",
                   "t=", film_name,
                   "&y=",
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
                $('#poster').attr('src', data.Poster);
                if (data.imdbRating && data.Metascore && data.Metascore != 'N/A'){
                    var difference = (data.imdbRating*10)-data.Metascore;
                    var score = 0;
                    if (difference > 0){
                        score = difference * Math.log(data.imdbRating*10);
                        score = Math.max(score, 0);
                    } else { /*on the pretencious spectrum */
                        console.log('difference: ' + difference);
                        score = difference * Math.log(data.Metascore*10);
                        score = Math.min(score, 100);
                        console.log('score: ' + score);
                    };
                    $('#pretentious-score').text(score);
                    var score = 50 - score/2;

                    $('.progress-bar').attr('style', 'width: ' + score + '%');
                    switch(true){
                        case (score >= 75):
                            $('#message').text('Get on your monocle. We have an overrated, pretencious turd. (' + score + ')');
                            break;
                        case (score > 50 && score < 75):
                            $('#message').text('Probably a fairly original film without being too esoteric. (' + score + ')');
                            break;
                        case( score <= 50 && score > 25):
                            $('#message').text('A film for normal people. (' + score + ')');
                            break;
                        case( score <= 25):
                            $('#message').text('Either unoriginal, slapstick, or mainstream.  (' + score + ')');
                            break;
                    };      
                } else {
                    $('#message').text('Film doesn\'t have a rating. Must suck.');

                };
            };

        });
            setTimeout(function() {
                $('#loader').hide();            
            }, 500); 
}