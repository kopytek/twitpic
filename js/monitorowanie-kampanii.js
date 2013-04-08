var dodajEfektyWizualneDoKampanii = function() {

	/* monitorowanie kampanii, dodajemy efekty kliknięcia kampanii */
	if (($(".stworzone-kampanie .komentarze-div ul").children().length) > 1) { 
		$(".stworzone-kampanie .nazwa-kampanii").on('click', function(event) {
			event.preventDefault();
			$(this).toggleClass("selected");

			$(".stworzone-kampanie .komentarze-div").slideToggle();
		});
	} else {
		$(".stworzone-kampanie .nazwa-kampanii").on('click', function(event) {
			event.preventDefault();
			$(this).toggleClass("selected");
			console.log("efekty dodane do kampanii, brak komentarzy");
		});

		$(".stworzone-kampanie .komentarze-div ul").append('<h2>Brak dodanych komentarzy</h2>');
	}
}

$(document).ready(function() {

	// zapytania GET na listę kampanii reklamowych 
	var miejsce = $(".monitorowanie-kampanii .container .stworzone-kampanie");

	// url dla serwera + link do pliku JSON z kampaniami
	$.getJSON('http://q4.maszyna.pl/api/adds', function (data){
		$.each(data, function(index, item){				
			// tworzymy szkielet html do którego będą wrzucone dane z GET
			
			var htmlString = "";
			htmlString += '<div class="row-fluid" data-id-kampanii="'+ item._id.$id + '" >';
			htmlString += '<li class="media well well-small span6 nazwa-kampanii">';
			htmlString += '<h2 class="text-info">' + item.name + '</h2>';
			htmlString += '<p class=" ">' + item.text + '</p>';
			htmlString += '</li>';
			htmlString += '</div';
			miejsce.append(htmlString);
		});
		dodajEfektyWizualneDoKampanii();
	});

});