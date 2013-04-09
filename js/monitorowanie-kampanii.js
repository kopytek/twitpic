/*
	monitorowanie kampanii
*/

var lista = $("ul.stworzone-kampanie li");	
var jsonObj = {
	campaigns: []
};
var _json;

function fuzzyS(campaigns) {

	console.log("inside functon");

	var input = $("#nazwaReklamy"),
			lista = $("ul.stworzone-kampanie li"),
			isCaseSensitive = false,
			fuse;

	// function search() {
	// 	var r = fuse.search(input.val());
	// 	$.each(r, function() {
	// 		console.log(this);
	// 		console.log(this.id, this.name);
	// 	});
	// }

	// function createFuse() {
	// 	var keys = [];

	// 	// tutaj dodajemy albo nazwe kampanii albo nazwe reklamy
	// 	// w tym momencie do testów będzie tylko nazwa reklamy
	// 	keys.push('name');
	// 	fuse = new Fuse(campaigns, {
	// 		keys : keys, 
	// 		isCaseSensitive: isCaseSensitive,
	// 		id: 'id'
	// 	});
	// }
	function search2() {
		var options = {
			keys: ['name'],
			id: 'id'
		}
		var f = new Fuse(campaigns.campaigns, options);
		var result = f.search(input.val());

		console.log(result);
	}


	input.on("keyup", search2);
	// createFuse();
}

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

var dodajWyswietlanieSzczegolow = function() {
	$(".pokaz-szczegoly").on('click', function(event) {
			event.preventDefault();
			$(this).parent().parent().find('.media-details').slideToggle();
	});
}

$(document).ready(function() {

	var alertBox = $(".monitorowanie-kampanii .alert-box");
	var miejsce = $(".monitorowanie-kampanii .container .stworzone-kampanie");
	// zapytania GET na listę kampanii reklamowych 
	$.ajax({
		url: 'http://q4.maszyna.pl/api/adds',
		type: 'get',
		dataType: 'json',

		error: function(){
			var errorBox = "";
			errorBox += '<div class="alert alert-error">';
      errorBox += 	'<h4><strong>Nie udało się pobrać informacji z serwera, wystąpił błąd.</strong></h4>';
    	errorBox += '</div>';
    	alertBox.append(errorBox);
			console.log("error");				
		},
		beforeSend: function() {
			var infoBox = "";
			infoBox += '<div class="alert alert-info">';
    	infoBox += 	'<h4><strong>Trwa pobieranie informacji z serwera, proszę czekać.</strong></h4>';
    	infoBox += '</div>';
    	alertBox.append(infoBox);
			console.log("wysyłamy zapytanie");
		},
		complete: function() {
			// usuwamy box alert-info, zostawiamy alert-error jeśli wystąpił błąd
			$(".alert-info").alert('close');
			console.log("request completed");
		},
		success: function(data) {
			$.each(data, function(index, item){

				jsonObj.campaigns.push({
					"id" : item._id.$id,
					"name": item.name
				});
				// tworzymy szkielet html do którego będą wrzucone dane z GET
				var htmlString = "";
				htmlString += '<li class="media span6" data-id-kampanii="'+ item._id.$id + '"' + 'data-nazwa-kampanii="'+ item.name + '"' +  '>';
				htmlString += 	'<div class="span12 well-campaign">';
				htmlString += 		'<div class="pull-left">';
				htmlString += 			'<img class="media-object" src="/uploads/' + item.path + '"' + '</img>';
				htmlString += 		'</div>';
				htmlString += 		'<div class="media-body">';
				htmlString += 			'<h1>' + item.name +  '</h1>';
				htmlString += 		'</div>';
				htmlString += 		'<div class="media-details">';
				htmlString += 			'<p class="lead">' + item.text +  '</p>';
				htmlString += 		'</div>';
				htmlString += 		'<div class="media-buttons">';
				htmlString += 			'<a href="#" class="pull-left pokaz-szczegoly" alt=""><i class="icon-comment"></i>Pokaż szczegóły</a>';
				htmlString += 			'<a href="#" class="pull-right usun-kampanie" alt=""><i class="icon-trash"></i>Usuń kampanię</a>';
				htmlString += 		'</div>';
				htmlString += 	'</div>';
				htmlString += '</li>';
				miejsce.append(htmlString);
			});
			$(".alert").alert('close')
			dodajEfektyWizualneDoKampanii();
			dodajWyswietlanieSzczegolow();
			// obiekt json, w którym przechowujemy informacje o kampaniach, id + nazwa
			// dzięku temu w filtrowaniu posłużymy się id do ukrywania
			
			// _json = JSON.stringify(jsonObj);
			fuzzyS(jsonObj);
			console.log("wszystko poszło wg planu");
		}
	});

	// // implementujemy podstawowe filtry
	// $("#nazwaReklamy").on("blur", function() {

	// 	// pobieramy string usera
	// 	var value = $(this).val().toLowerCase();
	// 	// pokazujemy wszystko
	// 	lista.show();
	// 	// ukrywamy
	// 	lista.not("[data-nazwa-kampanii*=" + value + "]").hide();
	// });
});