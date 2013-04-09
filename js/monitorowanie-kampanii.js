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
	var miejsce = $(".monitorowanie-kampanii .container .stworzone-kampanie");
	// zapytania GET na listę kampanii reklamowych 
	$.ajax({
		url: 'http://q4.maszyna.pl/api/adds',
		type: 'get',
		dataType: 'json',

		error: function(){
			var errorBox = "";
			errorBox += '<div class="alert alert-error">';
          	errorBox += '<h4><strong>Nie udało się pobrać informacji z serwera, wystąpił błąd.</strong></h4>';
        	errorBox += '</div>';
        	miejsce.append(errorBox);
			console.log("error");				
		},
		beforeSend: function() {
			var alertBox = "";
			alertBox += '<div class="alert alert-info">';
          	alertBox += '<h4><strong>Trwa pobieranie informacji z serwera, proszę czekać.</strong></h4>';
        	alertBox += '</div>';
        	miejsce.append(alertBox);
			console.log("wysyłamy zapytanie");
		},
		complete: function() {
			// usuwamy box alert-info, zostawiamy alert-error jeśli wystąpił błąd
			$(".alert-info").alert('close');
			console.log("request completed");
		},
		success: function(data) {
			$.each(data, function(index, item){				
				// tworzymy szkielet html do którego będą wrzucone dane z GET
				var htmlString = "";
				htmlString += '<div class="row-fluid" data-id-kampanii="'+ item._id.$id + '" >';
				htmlString += '<li class="media well well-small span6 nazwa-kampanii">';
				htmlString += '<h2 class="text-info">' + item.name + '</h2>';
				htmlString += '<p class=" ">' + item.text + '</p>';
				htmlString += '</li>';
				htmlString += '<button class="btn btn-danger" type="submit">Usuń kampanię</button>';
				htmlString += '</div';
				miejsce.append(htmlString);
			});
			$(".alert").alert('close')
			dodajEfektyWizualneDoKampanii();
			console.log("wszystko poszło wg planu");
		}
	});
});