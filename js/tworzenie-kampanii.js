/*
	tworzenie-kampanii.js
*/

var $lista_reklam = $('.lista-reklam-kampania'),
	$miejsceNaInfoBox = $('section.reklamy'),
	$stworzKampanieButton = $('.etap-trzeci #stworz-kampanie-button'),
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
	$lista_kont = $('.etap-drugi .media-list');

	$lista_kont.children().on('click', function() {
		if ($(this).find('li').hasClass('selected')) {
			etap_drugi = true;
		} else {
			etap_drugi = false; 
		}
		checkEtapy();
	});
}

/*	funkcja, która dodaje event pozwalający na dodanie efektu select dla kont */
function dodajEfektyWizualneDlaKont() {
	// sprawdzamy czy jakieś konta w ogóle istnieją
	if (($(".etap-drugi ul.media-list").children().length) > 1) {
		$lista_kont = $('.etap-drugi ul li');

		$lista_kont.on('click', function(event) {
			event.preventDefault();
			$(this).toggleClass("selected");
		});

		$("#odznacz-wszystkie-konta").on('click', function(event) {
			event.preventDefault();
			$lista_kont.each(function() {
				$(this).removeClass("selected");
			});
		});

		$("#zaznacz-wszystkie-konta").on('click', function(event) {
			event.preventDefault();
			$lista_kont.each(function() {
				$(this).addClass("selected");
			});
		});
	} else {
		$(".etap-drugi ul.media-list").append('<h2>Brak dodanych kont</h2><p class="lead">Nie zostały dodane jeszcze żadne konta, dodaj najpierw konto by móc stworzyć kampanię</p>');
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

/*	pobranie listy kont z serwera 
	el -> miejsce, w którym będziemy 'przypinać' kont, root dla kont
	infoBox -> miejsce, w którym będziemy wyświetlać informacje alertowe
*/
function pobierzListeKont(el, infoBox) {

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
	dodajEfektyWizualneDlaKont();

	validacjaDlaNazwyKampanii();


	// do zaimplementowania
	pobierzListeKont('root', 'infoBox');
	// przed tą funkcją będziemy robić GET na listę kont, potem dodamy validację
	validacjaDlaListyKont();
});