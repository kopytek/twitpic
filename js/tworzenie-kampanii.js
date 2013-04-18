/*
	tworzenie-kampanii.js
*/

var $lista_reklam = $('.lista-reklam-kampania'),
		$miejsceNaInfoBox = $('section.reklamy'),
		$stworzKampanieButton = $('.etap-trzeci #stworz-kampanie-button'),
		$lista_kont = $('.etap-drugi ul.media-list'),
		etap_pierwszy = false,
		etap_drugi = false,
		etap_trzeci = false;


/*	funkcja, która sprawdza czy zostały spełnione wymagania do stworzenia kampanii,
	usuwa klasę disabled z przycisku do tworzenia kampanii gdy użytkownik 
	wykonał wszystkie etapy */
function checkEtapy() {
	if (etap_pierwszy && etap_drugi && etap_trzeci) {
		$stworzKampanieButton.removeClass('disabled');
	} else { $stworzKampanieButton.addClass('disabled'); }
}

/*	funkcja, która dodaje validację dla nazwy kampanii */
function validacjaDlaNazwyKampanii() {
	$input = $(".etap-trzeci .nazwa-kampanii-input");
	
	$input.on('keyup', function() {
		if ($(this).val().length >=1) {
			etap_trzeci = true;	
		} else { etap_trzeci = false; }
		checkEtapy();
	});
}

/*	funkcja, która dodaje validację dla listy kont,
	sprawdzamy obecność klasy selected */
function validacjaDlaListyKont() {
	$lista_kont = $('.etap-drugi .media-list .media');
	etap_drugi = false; 
	
	$.each($lista_kont, function(index, item) {
		if ($(this).hasClass('selected')) {
			etap_drugi = true;
		}
	});
	checkEtapy();
}

/*	funkcja, która dodaje event pozwalający na dodanie efektu select dla kont */
function dodajEfektyWizualneDlaKont() {
	// sprawdzamy czy jakieś konta w ogóle istnieją
	if (($(".etap-drugi ul.media-list").children().length) > 1) {
		$_lista_kont = $('.etap-drugi ul.media-list li.media');

		$("#odznacz-wszystkie-konta").on('click', function(event) {
			event.preventDefault();
			$_lista_kont.each(function() {
				$(this).removeClass("selected");
			});
			etap_drugi = false;
			checkEtapy(); 
		});

		$("#zaznacz-wszystkie-konta").on('click', function(event) {
			event.preventDefault();
			$_lista_kont.each(function() {
				$(this).addClass("selected");
			});
			etap_drugi = true;
			checkEtapy();
		});
	} else {
		// $(".etap-drugi ul.media-list").append('<h2>Brak dodanych kont</h2><p class="lead">Nie zostały dodane jeszcze żadne konta, dodaj najpierw konto by móc stworzyć kampanię</p>');
	}
}

/*	funkcja, która dodaje event pozwalający na dodanie efektu select do wybranej reklamy */
function dodajEfektSelectDoReklam() {
	$lista_reklam.children().on('click', function(event) {
		event.preventDefault();
		console.log('klikamy');
		// pozwalamy by została tylko jedna reklama w tym momencie
		// musimy usunąć klasę 'selected' i dodać ją do nowego itemu
		$lista_reklam.find('.selected').removeClass('selected');
		$(this).addClass('selected');
		etap_pierwszy = true;
		checkEtapy();
	});
}

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

/*	funkcja, która tworzy box dla kont
		type
			error
			success
			info 
		content -> tresc boxa 
*/
function dodajInfoBoxKonta(el, type, content) {
	// usuwamy inne boxy jeśli istnieją
	$("ul.media-list .alert").alert('close');
	var infoBox = "";
			infoBox += '<div class="alert alert-' + type + '">';
    	infoBox += 	'<h4><strong>' + content + '</strong></h4>';
    	infoBox += '</div>';
	el.append(infoBox);
}

/*	funkcja, która odpowiada za dodanie odpowiedniego eventu
		dla przycisku disconnect konta 

		dodamy event + zapytanie ajax
*/
function dodajObslugePrzyciskuDelete(el) {

	// targetujemy specjalna klase pomocnicza
	$buttons = el.find('a.btn-disconnect');
	$.each($buttons, function(index, item) {
		console.log(item);

		$(item).bind('click', function() {
			event.preventDefault();
			console.log('lasdklas ');
			$.ajax({
				url: $(item).attr('data-href'),
				type: 'get',
				dataType: 'json',

				error: function() {
					console.log('error');
				},
				beforeSend: function() {
					console.log('wysyłamy zapytanie');
				},
				complete: function() {
					console.log('request completed');
				},
				success: function(data) {
					// event occurred, what now?

					// prosty refresh na początek
					window.location = window.location;

					console.log('udało się?');				
				}
			});
		});
	});
}
/*	funkcja, która odpowiada za dodanie odpowiedniego eventu
		dla przycisku wybierz konta 
*/
function dodajObslugePrzyciskuWybierzKonto(el) {
	// targetujemy specjalna klase pomocnicza
	$buttons = el.find('a.btn-zaznacz');
	$.each($buttons, function(index, item) {
		$(item).bind('click', function() {
			event.preventDefault();
			$(this).parent().parent().find('li.media').toggleClass('selected');	
			validacjaDlaListyKont();
		});
	});
}

/*	pobranie listy kont z serwera 
	el -> miejsce, w którym będziemy 'przypinać' kont, root dla kont
	oraz miejsce, w którym będziemy wyświetlać informacje alertowe
*/
function pobierzListeKont(el) {
	$.ajax({
		url: 'http://q4.maszyna.pl/oauth',
		type: 'get',
		dataType: 'json',

		error: function() {
			console.log('error');
			dodajInfoBoxKonta(el, 'error', 'Nie udało się pobrać listy kont z serwera, wystąpił błąd.');
		},
		beforeSend: function() {
			console.log('wysyłamy zapytanie');
			dodajInfoBoxKonta(el, 'info', 'Trwa pobieranie listy kont z serwera...');
		},
		complete: function() {
			console.log('request completed');
		},
		success: function(data) {
			dataObject = data;
			// sprawdzamy czy dostaliśmy pusty obiekt, jeśli tak to wyświetlamy 
			// info, że nie ma żadnych dodanych kont
			if ($.isEmptyObject(data)) {
				dodajInfoBoxKonta(el, 'info', 'Brak dodanych kont, kliknij zielony przycisk powyżej by dodać konto :)');
			} else {
				dodajInfoBoxKonta(el, 'success', 'Lista kont została poprawnie wczytana z serwera!');

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
						htmlString += 	'<li class="media well well-small span8">';
						htmlString += 		'<img class="media-object pull-left img-polaroid" src="' + item.account_data.profile_image_url.replace('_normal', '') + '"' + '</img>';
						htmlString += 		'<div class="media-body span8">';
						htmlString += 			'<h3>' + item.account_data.name +  '</h3>';
						htmlString += 			'<a href="http://twitter.com/' + item.screen_name + '" target="_blank" >';
						htmlString += 			'<h3>@' + item.screen_name + '</h3>';
						htmlString += 			'</a>';
						htmlString += 			'<p>' + item.account_data.description +'</p>';
						htmlString += 		'</div>';
						htmlString += 	'</li>';
						htmlString += 	'<div class="span8 buttons">';
						htmlString += 		'<a href="http://q4.maszyna.pl/oauth/connect/"' + item.id + '" class="btn btn-success"><i class="icon-refresh icon-white"></i>Połącz ponownie</a>';
						htmlString += 		'<a href="#" data-href="http://q4.maszyna.pl/oauth/disconnect/' + item.id + '" class="btn btn-warning btn-disconnect"><i class="icon-remove icon-white"></i>Odłącz konto</a>';
						htmlString += 		'<a href="#" class="btn btn-info btn-zaznacz"><i class="icon-ok icon-white"></i>Wybierz konto</a>';
						htmlString += 	'</div>';
						htmlString += '</div>';
						el.append(htmlString);
					} else {
						// musimy wyrenderować inny widok bo nie mamy wszystkich dostępnych pól
						var htmlString = "";
						htmlString += '<div class="row-fluid" data-id-konta="'+ item.id + '"' + ' data-screen-name-konta="'+ item.screen_name + '" >';
						htmlString += 	'<li class="media well well-small span8">';
						htmlString += 		'<div class="media-body span8">';
						htmlString += 			'<a href="http://twitter.com/' + item.screen_name + '" target="_blank" >';
						htmlString += 			'<h3>@' + item.screen_name + '</h3>';
						htmlString += 			'</a>';
						htmlString += 		'</div>';
						htmlString += 	'</li>';
						htmlString += 	'<div class="alert alert-error span8">';
			    	htmlString += 		'<h4><strong>Dostęp do konta w aplikacji został cofnięty przez właściciela konta, naciśnij Połącz ponownie by dokonać ponownej autoryzacji</strong></h4>';
			    	htmlString += 	'</div>';
						htmlString += 	'<div class="span8 buttons">';
						htmlString += 		'<a href="http://q4.maszyna.pl/oauth/connect/"' + item.id + '" class="btn btn-success"><i class="icon-refresh icon-white"></i>Połącz ponownie</a>';
						htmlString += 		'<a href="#" data-href="http://q4.maszyna.pl/oauth/disconnect/' + item.id + '" class="btn btn-warning btn-disconnect"><i class="icon-remove icon-white"></i>Odłącz konto</a>';
						htmlString += 	'</div>';
						htmlString += '</div>';
						el.append(htmlString);
					}	
				});
			}
			dodajObslugePrzyciskuDelete(el);
			dodajObslugePrzyciskuWybierzKonto(el);
			// będziemy sprawdzać obecność klasy selected by dodać validację
			dodajEfektyWizualneDlaKont();				
		}
	});
}

/*	pobranie listy reklam z serwera 
	el -> miejsce, w którym będziemy 'przypinać' reklamy, root dla reklam
	infoBox -> miejsce, w którym będziemy wyświetlać informacje alertowe
*/
function pobierzListeReklam(el, infoBox) {
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
			dodajEfektSelectDoReklam();
		}
	});
	console.log("pobierzListeReklam");
}

$(document).ready(function() {
	
	// pobieramy listę reklam z serwera
	pobierzListeReklam($lista_reklam, $miejsceNaInfoBox);
	
	// pobieramy listę kont z serwera
	pobierzListeKont($lista_kont);

	// sprawdzamy nazwę kampanii	
	validacjaDlaNazwyKampanii();

});