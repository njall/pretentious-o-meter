$( document ).ready(function(){
    $('#submit').click(function(){
        var film_name = $('#name').val();
        film_name = film_name.replace(/\ /g, '+');
        var url = ["http://www.omdbapi.com/?",
                   "t=", film_name,
                   "&y=",
                   "&plot=short",
                   "&r=json"].join('');
        var res = jQuery.getJSON(url, function( data ){
            console.log(data);
            console.log(data.Rating);
            var score = .5-((data.imdbRating*10)-data.Metascore)/200
            console.log(score);
            $('#meter').attr('value', score);
        });
    });
});

