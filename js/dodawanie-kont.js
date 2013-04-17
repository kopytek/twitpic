/*
	js for dodawanie-kont.html
*/

var $miejsceNaKonta = $('.lista-kont ul.media-list'),
		jsonObject,
		dataObject;

/*	funkcja, która tworzy box dla kont
		type
			error
			success
			info 
		content -> tresc boxa 
*/
function dodajInfoBox(el, type, content) {	
	// usuwamy inne boxy jeśli istnieją
	$(".alert").alert('close');
	var infoBox = "";
			infoBox += '<div class="alert alert-' + type + '">';
    	infoBox += 	'<h4><strong>' + content + '</strong></h4>';
    	infoBox += '</div>';
	el.append(infoBox);
}

/*	funkcja, która odpowiada za dodanie odpowiednich eventow
		dla przyciskow, będzie to connect / disconnect kont

		dodamy event + zapytanie ajax dla każdego z dostępnych przycisków
*/
function dodajObslugePrzyciskow(el) {

	$buttons = el.find('a.btn');

}

/*	funkcja, która pobiera listę kont z serwera */
function pobierzListKont(el) {
	$.ajax({
		url: 'http://q4.maszyna.pl/oauth',
		type: 'get',
		dataType: 'json',

		error: function() {
			console.log('error');
			dodajInfoBox(el, 'error', 'Nie udało się pobrać listy kont z serwera, wystąpił błąd.');
		},
		beforeSend: function() {
			console.log('wysyłamy zapytanie');
			dodajInfoBox(el, 'info', 'Trwa pobieranie listy kont z serwera...');
		},
		complete: function() {
			console.log('request completed');
		},
		success: function(data) {
			dataObject = data;
			// sprawdzamy czy dostaliśmy pusty obiekt, jeśli tak to wyświetlamy 
			// info, że nie ma żadnych dodanych kont
			if ($.isEmptyObject(data)) {
				dodajInfoBox(el, 'info', 'Brak dodanych kont, kliknij zielony przycisk powyżej by dodać konto :)');
			} else {
				dodajInfoBox(el, 'success', 'Lista kont została poprawnie wczytana z serwera!');

				setTimeout(function() {
					$('.alert-success').alert('close');
				}, 2000);
				console.log("request success");

				// udało się otrzymać listę kont z serwera, tworzymy dla nich szkielet html i 
				// przypinamy do DOM
				$.each(data, function(index, item) {

					// musimy sprawdzić czy item posiada pole 'account_data', jeśli nie ma 
					// takiego tzn, że został cofnięty access dla naszej aplikacji i trzeba
					// nacisnąć reconnect by jeszcze raz uzyskać dostęp
					if (item.hasOwnProperty('account_data')) {

						// tworzymy szkielet html do którego będą wrzucone dane z GET
						var htmlString = "";
						htmlString += '<div class="row-fluid" data-id-konta="'+ item.id + '"' + ' data-screen-name-konta="'+ item.screen_name + '"' + ' data-name-konta="'+ item.account_data.name + '" >';
						htmlString += 	'<li class="media well well-small span7">';
						htmlString += 		'<img class="media-object pull-left img-polaroid" src="' + item.account_data.profile_image_url.replace('_normal', '') + '"' + '</img>';
						htmlString += 		'<div class="media-body span8">';
						htmlString += 			'<h3>' + item.account_data.name +  '</h3>';
						htmlString += 			'<a href="http://twitter.com/' + item.screen_name + '" target="_blank" >';
						htmlString += 			'<h3>@' + item.screen_name + '</h3>';
						htmlString += 			'</a>';
						htmlString += 			'<p>' + item.account_data.description +'</p>';
						htmlString += 		'</div>';
						htmlString += 	'</li>';
						htmlString += 	'<div class="span7 buttons">';
						htmlString += 		'<a href="#" data-href="http://q4.maszyna.pl/oauth/connect/' + item.id + '" class="btn btn-success"><i class="icon-refresh icon-white"></i>Połącz ponownie</a>';
						htmlString += 		'<a href="#" data-href="http://q4.maszyna.pl/oauth/disconnect/' + item.id + '" class="btn btn-warning"><i class="icon-remove icon-white"></i>Odłącz konto</a>';
						htmlString += 	'</div>';
						htmlString += '</div>';
						el.append(htmlString);
					} else {
						// musimy wyrenderować inny widok bo nie mamy wszystkich dostępnych pól
						var htmlString = "";
						htmlString += '<div class="row-fluid" data-id-konta="'+ item.id + '"' + ' data-screen-name-konta="'+ item.screen_name + '" >';
						htmlString += 	'<li class="media well well-small span7">';
						htmlString += 		'<div class="media-body span8">';
						htmlString += 			'<a href="http://twitter.com/' + item.screen_name + '" target="_blank" >';
						htmlString += 			'<h3>@' + item.screen_name + '</h3>';
						htmlString += 			'</a>';
						htmlString += 		'</div>';
						htmlString += 	'</li>';
						htmlString += 	'<div class="alert alert-error span7">';
			    	htmlString += 		'<h4><strong>Dostęp do konta w aplikacji został cofnięty przez właściciela konta, naciśnij Połącz ponownie by dokonać ponownej autoryzacji</strong></h4>';
			    	htmlString += 	'</div>';
						htmlString += 	'<div class="span7 buttons">';
						htmlString += 		'<a href="#" data-href="http://q4.maszyna.pl/oauth/connect/' + item.id + '" class="btn btn-success"><i class="icon-refresh icon-white"></i>Połącz ponownie</a>';
						htmlString += 		'<a href="#" data-href="http://q4.maszyna.pl/oauth/disconnect/' + item.id + '" class="btn btn-warning"><i class="icon-remove icon-white"></i>Odłącz konto</a>';
						htmlString += 	'</div>';
						htmlString += '</div>';
						el.append(htmlString);
					}

					dodajObslugePrzyciskow(el);		
				});
			}			
		}
	});
}


$(document).ready(function() {

	// pobieramy listę kont z serwera 
	pobierzListKont($miejsceNaKonta);

});