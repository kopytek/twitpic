/* document.ready() */
$(document).ready(function() {


	console.log("jQuery is working. Prepare to have fun.");

	$("#wiadomoscDoWyslania").charCount({
		allowed: 140,
		warning: 30,
		counterText: 'Pozostało: '
	});


	/*  
		trochę kodu dla wizualizacji kliknięcia danego zdjęcia + dodanie
		eventów dla przycisków tak być działały 
	*/
	if (($(".etap-drugi ul.thumbnails").children().length) > 1) { 
		
		console.log("zdjęcia w kolekcji, eventy ON");

		$(".etap-drugi ul li a").on('click', function(event) {
			event.preventDefault();
			$(this).toggleClass("selected");
			console.log("img clicked");
		});

		$("#odznacz-wszystkie").on('click', function(event) {
			event.preventDefault();
			$(".etap-drugi ul li").each(function() {
				$(this).find('a').removeClass("selected");
			});
		});

		$("#zaznacz-wszystkie").on('click', function(event) {
			event.preventDefault();
			$(".etap-drugi ul li").each(function() {
				$(this).find('a').addClass("selected");
			});
		});

		// przyciski mogą być ukryte, let's show them
		$("#odznacz-wszystkie").show();
		$("#zaznacz-wszystkie").show(); 
	} else {
		$(".etap-drugi ul.thumbnails").append('<h2>Brak dodanych zdjęć</h2><p class="lead"> Nie zostały dodane jeszcze żadne zdjęcia do kolekcji, dodaj coś żeby móc stworzyć kampanię.</p>');
		$("#odznacz-wszystkie").hide();
		$("#zaznacz-wszystkie").hide();
	}
});