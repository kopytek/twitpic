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

/*	funkcja, która tworzy box informacyjny
		alertDest -> miejsce, z którego usuwamy stare alerty
		el -> miejsce, do którego przypinamy box 
		type -> error success info 
		content -> tresc boxa 
*/
function dodajInfoBox(alertDest, el, type, content) {
	// usuwamy inne boxy jeśli istnieją
	alertDest.find('.alert').alert('close');
	var infoBox = "";
	infoBox += '<div class="alert alert-' + type + ' span12">';
	infoBox += 	'<h4><strong>' + content + '</strong></h4>';
	infoBox += '</div>';
	el.append(infoBox);
}

/*	funkcja, która tworzy box dla reklamy 
		type -> error success info 
		content -> tresc boxa 
*/
function dodajInfoBoxKonta(el, type, content) {
	// usuwamy inne boxy jeśli istnieją
	$("ul.media-list .alert").alert('close');
	var infoBox = "";
			infoBox += '<div class="alert alert-' + type + ' span12">';
    	infoBox += 	'<h4><strong>' + content + '</strong></h4>';
    	infoBox += '</div>';
	el.append(infoBox);
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
	el -> miejsce, w którym będziemy 'przypinać' konta, root dla kont
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
			console.log('wysyłamy zapytanie konta');
			dodajInfoBoxKonta(el, 'info', 'Trwa pobieranie listy kont z serwera...');
		},
		complete: function() {
			console.log('request completed konta');
		},
		success: function(data) {
			dataObject = data;
			// sprawdzamy czy dostaliśmy pusty obiekt, jeśli tak to wyświetlamy 
			// info, że nie ma żadnych dodanych kont
			if ($.isEmptyObject(data)) {
				dodajInfoBoxKonta(el, 'info', 'Brak dodanych kont, konto możesz dodać na na stronie \'Dodawanie kont\'');
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

					// w tym miejscu będziemy pomijać konta, które zostały odłączone od naszej
					// aplikacji, pełna lista kont + przycisk będzie dostępna na /dodawanie-kont
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
						htmlString += 		'<a href="#" class="btn btn-info btn-zaznacz"><i class="icon-ok icon-white"></i>Wybierz konto</a>';
						htmlString += 	'</div>';
						htmlString += '</div>';
						el.append(htmlString);
					} 	
				});
			}
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
			dodajInfoBox($lista_reklam,infoBox,'error', "Nie udało się pobrać informacji z serwera, wystąpił błąd.");
			console.log("error");				
		},
		beforeSend: function() {
			dodajInfoBox($lista_reklam,infoBox, 'info', 'Trwa pobieranie informacji z serwera, proszę czekać.');
			console.log("wysyłamy zapytanie");
		},
		complete: function() {
			// usuwamy box alert-info, zostawiamy alert-error jeśli wystąpił błąd
			$(".lista-reklam-kampania .alert-info").alert('close');
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
/*	funkcja, która czyści dane wpisane / kliknięte przez użytkownika 
		podczas procesu tworzenia kampanii */  
function wyczyscDaneTworzeniaKampanii() {

	// lista reklam
	$.each($lista_reklam.children(), function(index, item) {
		$(this).removeClass('selected');
	});

	// lista kont
	if (($(".etap-drugi ul.media-list").children().length) > 1) {
		$_lista_kont = $('.etap-drugi ul.media-list li.media');

		$.each($_lista_kont, function(item, index) {
			$(this).removeClass('selected');
		});	
	}

	// nazwa kampanii	
	$input = $(".etap-trzeci .nazwa-kampanii-input");
	$input.val = " ";	
}

/*	funkcja, która dodaje akcję po naciśnięciu przycisku 'Stwórz Kampanię' */
function dodajObslugePrzyciskuStworzKampanie() {

	// tworzymy zapytanie POST, przesyłamy
	// POST[] = {
 	// 'name': 'słoneczko :)',
 	// 'add': 'id reklamy',
 	// 'accounts': 'lista id kont, id przedzielone przecinkami'

 	$stworzKampanieButton.on('click', function(event) {
 		event.preventDefault();

 		// zbieramy informacje potrzebne do stworzenia kampanii
	 	$nazwa_kampanii = $(".etap-trzeci .nazwa-kampanii-input").val();
	 	$id_reklamy = $lista_reklam.find('.selected').attr('data-id-reklamy');
	 	
	 	// musimy znaleźć id kont, dany element li ma klasę selected jeśli został 
	 	// wybrany, natomiast data-id-kampanii jest przetrzymywana w elemencie wyżej
	 	// w div.row-fluid 

	 	$id_kont = '';

	 	$selected = $('.etap-drugi ul.media-list').children().find('li.selected');
	 	// przechodzimy po wszystkich elementach, zapisujemy id-kont
	 	$.each($selected, function(index, item) {
	 		$id_kont += $(this).parent().attr('data-id-konta');
	 		// jeśli jest ostatni element to nie dodajemy już przecinka
	 		if (index != ($selected.length - 1 )) {
	 			$id_kont += ',';
	 		}
	 	});

	 	// miejsce gdzie będzie przypinany box alterowy
	 	$alertDest = $('.etap-trzeci .row-fluid:last-child');

	 	$.ajax({
			url: 'http://q4.maszyna.pl/api/campaigns/publish',
			type: 'post',
			dataType: 'json',
			data: {
				'name': $nazwa_kampanii,
				'add': $id_reklamy,
				'accounts': $id_kont
			},

			error: function(){
				dodajInfoBox($alertDest, $alertDest, 'error', 'Nie udało się stworzyć kampanii reklamowej, spróbuj ponownie później.');
				console.log("error");				
			},
			beforeSend: function() {
				dodajInfoBox($alertDest, $alertDest, 'info', 'Trwa wysyłanie zapytania do serwera...');
				console.log("wysyłamy zapytanie");
			},
			complete: function() {
				// usuwamy box alert-info, zostawiamy alert-error jeśli wystąpił błąd
				// $(".lista-reklam-kampania .alert-info").alert('close');
				console.log("request completed");
			},
			success: function(data) {
				dodajInfoBox($alertDest, $alertDest, 'success', 'Kampania reklamowa została stworzona, możesz zobaczyć ją w zakładce \'Monitorowanie kampanii\'');
				wyczyscDaneTworzeniaKampanii();
			}
		});
 	});
}


$(document).ready(function() {
	
	// pobieramy listę reklam z serwera
	pobierzListeReklam($lista_reklam, $miejsceNaInfoBox);
	
	// pobieramy listę kont z serwera
	pobierzListeKont($lista_kont);

	// sprawdzamy nazwę kampanii	
	validacjaDlaNazwyKampanii();

	dodajObslugePrzyciskuStworzKampanie();

});