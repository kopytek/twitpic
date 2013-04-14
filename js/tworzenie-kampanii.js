/*
	tworzenie-kampanii.js
*/

var $lista_reklam = $('.lista-reklam-kampania'),
	$miejsceNaInfoBox = $('section.reklamy');

/*	funkcja, która dodaje event pozwalający na pokazanie szczegółów reklamy */
function dodajWyswietlanieSzczegolow() {
	$(".pokaz-szczegoly").on('click', function(event) {
		event.preventDefault();
		$(this).parent().parent().find('.media-details').slideToggle();
		$(this).parent().parent().find('.media-body').slideToggle();
	});
}

/*	funkcja, która tworzy box dla reklamy 
		type -> error success info 
		content -> tresc boxa 
*/
function dodajInfoBox(el, type, content) {	
	// usuwamy inne boxy jeśli istnieją
	$(".lista-reklam-kampania .alert").alert('close');
	var infoBox = "";
	infoBox += '<div class="alert alert-' + type + ' span12">';
	infoBox += 	'<h4><strong>' + content + '</strong></h4>';
	infoBox += '</div>';
	el.append(infoBox);
}

/*	pobranie listy reklam z serwera */
function pobierzListReklam(el, infoBox) {
	$.ajax({
		url: 'http://q4.maszyna.pl/api/adds',
		type: 'get',
		dataType: 'json',

		error: function(){
			dodajInfoBox(infoBox,'error', "Nie udało się pobrać informacji z serwera, wystąpił błąd.");
			console.log("error");				
		},
		beforeSend: function() {
			dodajInfoBox(infoBox, 'info', 'Trwa pobieranie informacji z serwera, proszę czekać.');
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
				htmlString += '<div class="reklama-item well-custom" data-id-reklamy="'+ item._id.$id + '"' + 'data-nazwa-reklamy="'+ item.name + '"' +  '>';
				htmlString += 		'<div class="img-holder">';
				htmlString += 			'<img class="media-object" src="/uploads/' + item.path + '"' + '</img>';
				htmlString += 		'</div>';
				htmlString += 		'<div class="media-body">';
				htmlString += 			'<h1>' + item.name +  '</h1>';
				htmlString += 		'</div>';
				htmlString += 		'<div class="media-details">';
				htmlString += 			'<p class="lead">' + item.text +  '</p>';
				htmlString += 		'</div>';
				htmlString += 		'<div class="media-buttons">';
				htmlString += 			'<a href="#" class="pull-left pokaz-szczegoly" alt=""><i class="icon-edit"></i>Pokaż szczegóły</a>';
				htmlString += 		'</div>';
				htmlString += '</div>';
				el.append(htmlString);
			});
			$(".alert").alert('close');
			dodajWyswietlanieSzczegolow();
		}
	});
	console.log("pobierzListReklam");
}

$(document).ready(function() {
	// pobieramy listę reklam z serwera
	pobierzListReklam($lista_reklam, $miejsceNaInfoBox);

});