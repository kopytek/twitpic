$(document).ready(function() {

	/* monitorowanie kampanii, dodajemy efekty kliknięcia kampanii */
	if (($(".stworzone-kampanie .komentarze-div ul").children().length) > 1) { 
		$(".stworzone-kampanie .nazwa-kampanii").on('click', function(event) {
			event.preventDefault();
			$(this).toggleClass("selected");

			$(".stworzone-kampanie .komentarze-div").slideToggle();
		});
	} else {
		$(".stworzone-kampanie .komentarze-div ul").append('<h2>Brak dodanych komentarzy</h2>');
	}


	// zapytania 

	var miejsce = $(".monitorowanie-kampanii .container");

	$.getJSON('http://q4.maszyna.pl/api/adds', function (data){
		$.each(data, function(index, item){
			miejsce.append("<p>" + item._id.$id + item.name + item.path + item.text + "</p>");
		});
	});

// $.ajax({
//    url: "http://q4.maszyna.pl/api/adds",
//     dataType: 'json',
//     success: function(data){
//         console.log(data);
//      }
//  });

	// $.ajax({
 //     type: "GET",
 //     url: filename,
 //     async: false,
 //     beforeSend: function(x) {
 //      if(x &amp;&amp; x.overrideMimeType) {
 //       x.overrideMimeType("application/j-son;charset=UTF-8");
 //      }
 // },
 // dataType: "json",
 // success: function(data){
 //    //do your stuff with the JSON data
 // }
// });

});