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

});