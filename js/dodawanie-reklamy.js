/*
	js for dodawanie-reklamy.html

*/

var b1 = false, // etap-pierwszy textarea test
		b2 = false, // etap-trzeci input test
		sK = $("#stworz-reklame-button"),
		etap_pierwszy = $(".etap-pierwszy textarea"),
		etap_trzeci_input = $(".etap-trzeci .nazwa-reklamy-input"),
		alertBox = $(".wyswietlanie-reklam .alert-box"),
		miejsce = $(".wyswietlanie-reklam .lista-reklam"),
		testWysylania = true;


/*	ilość znaków dodawanych do zdjęcia jako komentarz jest ograniczona,
		pokazujemy użytkownikowi ile pozostało mu znaków do limitu

		sprawdzamy czy val() dla textarea jest większe od 1, jeśli tak to 
		użytkownik będzie mógł stworzyć reklamę (+ jeszcze inne wymagania)
*/
var validacjaTextarea = function() {
	/* plugin dla textarea do sprawdzania ilości znaków */	
	$("#wiadomoscDoWyslania").charCount({
		allowed: 140,
		warning: 30,
		counterText: 'Pozostało: '
	});

	etap_pierwszy.on('keyup', function() {
		if (etap_pierwszy.val().length >= 1) {
			b1 = true;
		} else { b1 = false; }
		checkEtapy();
	});
}

/*	sprawdzamy czy użytkownik wybrał nazwę dla kampanii i wpisał ją w input */
var validacjaNazwyReklamy = function() {
	etap_trzeci_input.on('keyup', function() {
		if (etap_trzeci_input.val().length >=1) {
			b2 = true;
		} else { b2 = false; }
		checkEtapy();
	});
}

/*	sprawdzenie czy użytkownił wykonał 2 wymagane etapy przy tworzeniu reklamu,
		jeśli tak to przycisk tracki klasę 'disabled'
*/ 
var checkEtapy = function() {
	if (b1 && b2 ){
		sK.removeClass('disabled');
	} else { 
		sK.addClass('disabled'); 
	}
}

/*	osbługa przycisku pokaż szczegóły dla reklam */
// var dodajWyswietlanieSzczegolow = function() {
// 	$(".pokaz-szczegoly").on('click', function(event) {
// 			event.preventDefault();
// 			$(this).parent().parent().find('.media-details').slideToggle();
// 	});
// }

/*	funkcja, która dodaje event do przycisku tak by móc śledzić klik na button
		i wywołać właściwą funkcję

		funkcja te wywołuje właściwa funkcję do usuwania rekordu, wysyła cały div 
		z reklamą
*/
function dodajMozliwoscUsuwania() {
	$(".reklama-item .usun-reklame").on('click', function(event) {
		event.preventDefault();
		usunWybranaReklame($(this).parent().parent());
		console.log($(this));
	});	
}

/*	funkcja, która pozwala na usunięcie wybranej reklamy przez użytkownika */
function usunWybranaReklame(el) {
	var id_el = el.attr("data-id-reklamy");
	console.log(id_el);

	// GET /api/adds/delete/{id}
	$.ajax({
		url: 'http://q4.maszyna.pl/api/adds/delete/' + id_el,
		type: 'get',
		dataType: 'json',

		error: function(){
			// var errorBox = "";
			// errorBox += '<div class="alert alert-error">';
   //    errorBox += 	'<h4><strong>Nie udało się pobrać informacji z serwera, wystąpił błąd.</strong></h4>';
   //  	errorBox += '</div>';
   //  	alertBox.append(errorBox);
			console.log("error");				
		},
		beforeSend: function() {
			// var infoBox = "";
			// infoBox += '<div class="alert alert-info">';
   //  	infoBox += 	'<h4><strong>Trwa pobieranie informacji z serwera, proszę czekać.</strong></h4>';
   //  	infoBox += '</div>';
   //  	alertBox.append(infoBox);
			console.log("wysyłamy zapytanie");
		},
		complete: function() {
			// usuwamy box alert-info, zostawiamy alert-error jeśli wystąpił błąd
			// $(".alert-info").alert('close');
			console.log("request completed");
		},
		success: function(data) {
			// chowamy div a potem go usuwamy z listy
			el.fadeOut(400, function() {
				$(this).remove();
			});
			console.log("success fired@@");
		}
	});
}

/*	funkcja, która wysyła reklame na serwer */
function wyslijReklameNaSerwer(el) {

	$id = el.attr("data-id-reklamy");
	$name = el.find('.media-body > *').html();
	$text = el.find('.media-details > *').html();

	// console.log($id, $name, $text);	

	// ten if to taki 'zamek' (mutex)
	// przed wysłaniem ustawiamy testWysylania na false
	// po tym jak zapytanie się wyknało zmieniamy na true
	if (testWysylania) {
		$.ajax({
			url: 'http://q4.maszyna.pl/api/adds/' + id,
			type: 'post',
			dataType: 'json',
			data: {
				'name': $name,
				'text': $text
			},
			error: function(){
				console.log("error");
				dodajInfoBox(el, 'error', 'Zmiany nie zostały zapisane, błąd wysłania danych!');
				setTimeout(function() {
					$(".alert-error").alert('close');
				}, 2500);				
			},
			beforeSend: function() {
				console.log("wysyłamy zapytanie");
				testWysylania = false;
			},
			complete: function() {
				console.log("request completed");
				testWysylania = true;
			},
			success: function(data) {
				// zamykamy alert-info
				// $(".alert-info").alert('close');
				dodajInfoBox(el, 'success', 'Zmiany zostały zapisane, reklama została zaktualizowana!');

				setTimeout(function() {
					$(".alert-success").alert('close');
				}, 2000);

				console.log("request success");
			}
		});
	}
}

/*	funkcja, która dodaje event pozwalający na edytowanie reklamy */
function dodajMozliwoscEdycji() {
	$(".reklama-item .edytuj-reklame").on('click', function(event) {
		event.preventDefault();
		edytujWybranaReklame($(this).parent().parent());
	});	
}

/*	funkcja, która dodaje event pozwalający na zapisanie wprowadzonych zmian
		w reklamie, wywołuje funkcję do wysyłania zmian na serwer */
function dodajZapisanieZmian(el, edit) {
	edit.find('.zapisz-zmiany').on('click', function(event) {
		event.preventDefault();		

		// dodajemy validacje, nie możemy pozwolić by ktoś wysłał reklamę
		// bez nazwy albo tekstu reklamowego
		$name = el.find('.media-body > *').text();
		$text = el.find('.media-details > *').text();
		
		// sprawdzamy czy coś zostało wpisane 
		// tekst reklamy nie może być dłuższy niż 140 znakow
		if ($name.length >=1 && $text.length >=1 && $text.length <= 139) {

			// ustawiamy contenteditable na false
			ustawContentEditable(el, false);
			// pokazujemy defaultowy stan pasków z przyciskami
			el.find('.media-buttons.normal').show();
		 	el.find('.media-buttons.edit').hide();
		 	// zapisujemy w localStorage aktualna wersje reklamy 
			zapiszReklameToLS(el);
			dodajMozliwoscEdycji();
			// wysyłamy zmodyfikowaną reklamę na serwer
			wyslijReklameNaSerwer(el);
		} else {
			// użytkownik zostawił jakieś pole puste, wyświetlamy box i nie wysyłamy reklamy
			dodajInfoBox(el, 'error', 'Zostawiłeś puste pole, uzupełnij brakujący tekst!');
		}
	 	
	});	
}

/*	funkcja, która dodaje event pozwalający na odrzucenie zmian w reklamie */
function dodajOdrzucenieZmian(el, edit) {
	edit.find('.odrzuc-zmiany').on('click', function(event) {
		event.preventDefault();
		// pokazujemy defaultowy stan pasków z przyciskami
		el.find('.media-buttons.normal').show();
	 	el.find('.media-buttons.edit').hide();
	 	// ustawiamy contenteditable na false
		ustawContentEditable(el, false);
		// przywracamy stan reklamy zapisany w localStorage
		przywrocReklameFromLS(el);
		// usuwamy boxy jeśli istnieją
		$(".lista-reklam .alert").alert('close');
		dodajMozliwoscEdycji();
	});	
}


/*	funkcja, która zapisuje reklamę do Local Storage */
function zapiszReklameToLS(el) {
	id = el.attr("data-id-reklamy");
	if (localStorage.getItem(id)) {
		localStorage.setItem(id,el.html());
	}
}

/*	funkcja, która przywraca stan reklamy zapisany w Local Storage */
function przywrocReklameFromLS(el) {
	id = el.attr("data-id-reklamy");
	// sprawdzamy czy istenieje kopia reklamy w localStorage
	if (localStorage.getItem(id)) {
		el.html(localStorage.getItem(id)); 
	}
}

/*	funkcja, która usuwa dane z localStorage */
function wyczyscLS() {
	localStorage.clear();
}

/*	funkcja, która tworzy box dla reklamy 
		type
			error
			success
			info 
		content -> tresc boxa 
*/
function dodajInfoBox(el, type, content) {	
	// usuwamy inne boxy jeśli istnieją
	$(".lista-reklam .alert").alert('close');
	var infoBox = "";
			infoBox += '<div class="alert alert-' + type + '">';
    	infoBox += 	'<h4><strong>' + content + '</strong></h4>';
    	infoBox += '</div>';
	el.after(infoBox);
}

/*	funkcja, która pozwala na ustawienie contenteditable, przysyłamy do niej 
		true or false */ 
function ustawContentEditable(el, bool) {
	el.find('.media-body').attr('contenteditable', bool);
	el.find('.media-details').attr('contenteditable', bool);
}

/* edytujemy wybraną reklamę, zmiany musimy ponownie wysłać na serwer */
function edytujWybranaReklame(el) {
	id = el.attr("data-id-reklamy");
	
	// zapisujemy reklame do localStorage jeśli reklama nie jest jeszcze zapisana
	if (!localStorage.getItem(id)) {
		localStorage.setItem(id,el.html());
	}	
	
	// ustawiamy contenteditable na true
	ustawContentEditable(el, true);

	// ukrywamy podstawowy pasek z przyciskami, pokazujemy ten do edycji reklamy
	el.find('.media-buttons.normal').hide();
	var edit = el.find('.media-buttons.edit').show();
	
	// dodajemy eventy do przyciskow
	dodajZapisanieZmian(el, edit);
	dodajOdrzucenieZmian(el, edit);

	// dodajemy infoBox
	dodajInfoBox(el, 'info', 'Pamiętaj by nie zostawić pustej nazwy reklamy ani tekstu reklamowego.');
}

/*	pobranie listy reklam z serwera */
function pobierzListReklam() {
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
				htmlString += 		'<div class="media-buttons normal">';
				htmlString += 			'<a href="#" class="pull-left edytuj-reklame" alt=""><i class="icon-edit"></i>Edytuj reklamę</a>';
				htmlString += 			'<a href="#" class="pull-right usun-reklame" alt=""><i class="icon-trash"></i>Usuń reklamę</a>';
				htmlString += 		'</div>';
				htmlString += 		'<div class="media-buttons edit">';
				htmlString += 			'<a href="#" class="pull-left zapisz-zmiany" alt=""><i class="icon-ok"></i>Zapisz zmiany</a>';
				htmlString += 			'<a href="#" class="pull-right odrzuc-zmiany" alt=""><i class="icon-remove"></i>Odrzuć zmiany</a>';
				htmlString += 		'</div>';
				htmlString += '</div>';
				miejsce.append(htmlString);
			});
			$(".alert").alert('close');
			// dodajWyswietlanieSzczegolow();
			dodajMozliwoscEdycji();
			dodajMozliwoscUsuwania();
		}
	});
	console.log("pobierzListReklam");
}

$(document).ready(function() {

	pobierzListReklam();
	validacjaTextarea();
	validacjaNazwyReklamy();
	wyczyscLS();

	/* tworzenie reklamy */
	$("#stworz-reklame-button").on('click', function() {
		/* tworzymy reklamę, POST na /api/adds */
	  $('#fileupload').fileupload({
	    dataType: 'json',
	    type:     'POST',
	    url:      "http://q4.maszyna.pl/api/adds",
	    formData: {
	      'name': $('#nazwaReklamy').val(),
	      'text': $('#wiadomoscDoWyslania').val()
	    },
	    add: function (e, data) {
	      data.context = $('#stworz-reklame-button');
	      $("#commercial_create_form").unbind('submit');
	      $("#commercial_create_form").submit(function(){
	        data.submit();
	        return false; 
	      });   
	    },
	    done: function (e, data) {
	      console.log(data);
	      if(data.result && data.result.files) {
	        $.each(data.result.files, function (index, file) {
	          $('#commercial_create_form fieldset').append('<div class="alert alert-info"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Dodano:</strong> '+file.name+'</div>');
	        });
	      }
	      else {
	        $('#commercial_create_form fieldset').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Blad\' !</strong> Zła odpowiedź</div>');
	      }

	      // pobieramy ponownie listę reklam
	      pobierzListReklam();	
	    },
	    fail: function(e, data) {
	      $('#commercial_create_form fieldset').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Blad\' !</strong> niczego nie wgrałem</div>');
	    }
	  });
	});
	
}); //end of document.ready()