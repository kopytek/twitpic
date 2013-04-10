/*
	js for dodawanie-reklamy.html

*/

var b1 = false, // etap-pierwszy textarea test
		b2 = false, // etap-trzeci input test
		sK = $("#stworz-reklame-button"),
		etap_pierwszy = $(".etap-pierwszy textarea"),
		etap_trzeci_input = $(".etap-trzeci .nazwa-reklamy-input"),
		alertBox = $(".wyswietlanie-reklam .alert-box"),
		miejsce = $(".wyswietlanie-reklam .lista-reklam");


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
var dodajWyswietlanieSzczegolow = function() {
	$(".pokaz-szczegoly").on('click', function(event) {
			event.preventDefault();
			$(this).parent().parent().find('.media-details').slideToggle();
	});
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
				htmlString += 		'<div class="media-buttons">';
				htmlString += 			'<a href="#" class="pull-left pokaz-szczegoly" alt=""><i class="icon-comment"></i>Pokaż szczegóły</a>';
				htmlString += 			'<a href="#" class="pull-right usun-reklame" alt=""><i class="icon-trash"></i>Usuń reklamę</a>';
				htmlString += 		'</div>';
				htmlString += '</div>';
				miejsce.append(htmlString);
			});
			$(".alert").alert('close');
			dodajWyswietlanieSzczegolow();
		}
	});
	console.log("pobierzListReklam");
}

$(document).ready(function() {

	pobierzListReklam();
	validacjaTextarea();
	validacjaNazwyReklamy();
	
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
	    },
	    fail: function(e, data) {
	      $('#commercial_create_form fieldset').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Blad\' !</strong> niczego nie wgrałem</div>');
	    }
	  });
	});
	
}); //end of document.ready()