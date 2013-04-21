/*
	monitorowanie kampanii
*/

var lista = $("ul.stworzone-kampanie li");	
var jsonObj = {
	campaigns: []
};
var _json;


/*	funkcja, która odpowiada za ustawienie pluginu timeago */
function timeAgo() {
	$('time.timeago').timeago();
	console.log('timeagooooo');
}


function fuzzyS(campaigns) {

	console.log("inside functon");

	var input = $("#nazwaReklamy"),
			lista = $("ul.stworzone-kampanie li"),
			isCaseSensitive = false,
			fuse;

	function search2() {
		var options = {
			keys: ['name'],
			id: 'id'
		}
		var f = new Fuse(campaigns.campaigns, options);
		var result = f.search(input.val());
	
		// jeśli jest pusty response to pokazujemy wszystkie elementy na liscie 
		if (result.length == 0 ) {
			$("ul.stworzone-kampanie li").show();
		} else {
			// response nie jest pusty, ukrywamy / pokazujemy elementy bo zostało coś znalezione
			$lista = $('.stworzone-kampanie li.media');
			
			// przechodzimy po kolei po wszystkich elementach listy
			$.each($lista, function(el) {
				znaleziony = false;
				// ustawiamy id danej kampanii 
				$id =  $(this).attr('data-id-kampanii');
				// przechodzimy przez wszystkie wyniki z Fuse
				$.each(result, function(i,item) {
					if ($id === item) { 
						// element znaleziony
						znaleziony = true;
				 	}	
				});

				// jeśli element został znaleziony to go pokazujemy, inaczej hide
				if (znaleziony) { 
					$(this).show();
				} else { $(this).hide(); }
			}); 
		}	
	}

	input.on("keyup", search2);
}

// var dodajEfektyWizualneDoKampanii = function() {

// 	/* monitorowanie kampanii, dodajemy efekty kliknięcia kampanii */
// 	if (($(".stworzone-kampanie .komentarze-div ul").children().length) > 1) { 
// 		$(".stworzone-kampanie .nazwa-kampanii").on('click', function(event) {
// 			event.preventDefault();
// 			$(this).toggleClass("selected");

// 			$(".stworzone-kampanie .komentarze-div").slideToggle();
// 		});
// 	} else {
// 		$(".stworzone-kampanie .nazwa-kampanii").on('click', function(event) {
// 			event.preventDefault();
// 			$(this).toggleClass("selected");
// 			console.log("efekty dodane do kampanii, brak komentarzy");
// 		});

// 		$(".stworzone-kampanie .komentarze-div ul").append('<h2>Brak dodanych komentarzy</h2>');
// 	}
// }

/*	funkcja, która tworzy box dla reklamy 
		type -> error success info 
		content -> tresc boxa 
*/
function dodajInfoBox(el, type, content) {	
	// usuwamy inne boxy jeśli istnieją
	$(".stworzone-kampanie .alert").alert('close');
	var infoBox = "";
	infoBox += '<div class="alert alert-' + type + ' ">';
	infoBox += 	'<h4><strong>' + content + '</strong></h4>';
	infoBox += '</div>';
	el.append(infoBox);
}


// var dodajWyswietlanieSzczegolow = function() {
// 	$(".pokaz-szczegoly").on('click', function(event) {
// 			event.preventDefault();
// 			$(this).parent().parent().find('.media-details').slideToggle();
// 	});
// }




var $miejsceNaKampanie = $('.stworzone-kampanie'),
		jsonC,
		listaKont; 


/*	funkcja, która wczytuje komentarze z serwera i dodaje je do widoku kampanii */
function wczytajKomentarzeDlaKampanii(el) {

	// będziemy przechodzić po każdej kampanii i tworzyć dla niej zapytanie + dodawać
	// komentarze 

	$.each(el.children().filter('article'), function(index, item) {
		// przechodzimy po kolejnej kampanii
		id_kampanii = $(this).attr('data-id-kampanii');
		$.ajax({
			url: 'http://q4.maszyna.pl/api/campaigns/feedback/' + id_kampanii, 
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
				// zapisujemy nad jaką kampanią 'pracujemy'
				campaign = el.children().filter('article[data-id-kampanii="'+id_kampanii+'"]');
				// miejsce gdzie będziemy umieszczać komentarze
				comments = campaign.find('ul.comments');	
				// sprawdzamy czy zostały dodane jakieś komentarze
				if ($.isEmptyObject(data)) {
					// nie ma dodanych jeszcze żadnych komentarzy
					var htmlString = "";
					htmlString += '<h3 class="text-warning">Brak komentarzy do kampanii</h3>';
					comments.append(htmlString);
				} else {
					// dostaliśmy komentarze, wyświetlamy je
				}
				console.log(data);
			}
		});
	});
}

/*	funkcja, która odpowiada za pobranie listy kampanii z serwera
		i wyświetlenie pobranych kampanii */
function pobierzListeKampanii(el) {

	$.ajax({
		url: 'http://q4.maszyna.pl/api/campaigns',
		type: 'get',
		dataType: 'json',
		error: function() {
			console.log('error');
			dodajInfoBox(el, 'error', 'Nie udało się pobrać listy kampanii z serwera, wystąpił błąd.');
		},
		beforeSend: function() {
			console.log('wysyłamy zapytanie');
			dodajInfoBox(el, 'info', 'Trwa pobieranie listy kampanii z serwera...');
		},
		complete: function() {
			console.log('request completed');
		},
		success: function(data) {
			dodajInfoBox(el, 'success', 'Lista kampanii została poprawnie wczytana z serwera!');
			setTimeout(function() {
				$('.alert-success').alert('close');
			}, 2000);

			$.each(data, function(index, item) {

				// console.log(item);
				jsonC = item;

				// tworzymy szkielet html do którego będą wrzucone dane z GET
				var htmlString = "";
				htmlString += '<article class="campaign-item well-custom row-fluid" data-id-kampanii="'+ item.id + '"' + 'data-nazwa-kampanii="'+ item.name + '"' +  '>';
				htmlString += 	'<header class="span12 campaign-title" >';
				htmlString += 		'<h1>' + item.name + '</h1>';
				htmlString += 	'</header>';
				htmlString += 	'<div class="row-fluid" >';
				htmlString += 		'<div class="campaign-add span6" >';
				htmlString += 			'<img class="media-object" src="/uploads/' + item.add.path + '"' + '</img>';
				htmlString += 			'<p class="lead">' + item.add.text + '</p>';
				htmlString += 			'<div class="campaign-accounts">';
				htmlString += 				'<h4 class="text-info">Konta biorące udział w kampanii</h4>';
				htmlString += 				'<hr>';
				htmlString += 				'<ul class="media-list accounts">';

				// accounts są przekazywane jako obiekt, który może zawierać wiele elementów
				// potrzebujemy kolejny .each żeby przejśc po każdym obiekcie

				$.each(item.accounts, function(indexA,itemA) {
					htmlString +=	'<li class="media account" data-id-account="' + itemA.id + '"' +  '>';
					htmlString += 	'<a class="pull-left" href="http://twitter.com/' + itemA.screen_name + '" >	';
					htmlString += 		'<h3>@' + itemA.screen_name + '</h3>';
					htmlString += 	'</a>';
					htmlString += '</li>';
				});

				htmlString += 				'</ul>';
				htmlString += 			'</div>';
				htmlString += 		'</div>';
				htmlString += 		'<div class="campaign-comments span6">';
				htmlString += 			'<h4 class="text-info">Komentarze</h4>';
				htmlString += 			'<hr>';
				// sekcja z komentarzami, wczytamy ją dopiero po stworzeniu wszystkich 
				// kampanii, na końcu będzie jej wywołanie 
				htmlString += 				'<ul class="media-list comments">';
				htmlString += 				'</ul>';
				htmlString += 		'</div>';
				htmlString += 	'</div>';
				
				// potrzebujemy znów przejść po obiekcie i znaleźć link do kampanii
				// w serwisie twitpic
				$.each(item.twitpic_data, function(indexL, itemL) {
					link_do_kampanii = itemL.url;
				});

				htmlString += 	'<footer class="campaign-info span12">';
				htmlString += 		'<p><i class="icon-time"></i><time class="timeago" datetime="'+ item.published + '"></time></p>';
				htmlString += 		'<p><a href="' + link_do_kampanii + '" title="Link do kampanii w serwisie twitpic">' + link_do_kampanii + '</a></p>';
				htmlString += 	'</footer>';
				htmlString += '</article>';

				el.append(htmlString);
			});
			// timeago
			timeAgo();
			// wczytujemy komentarze dla kampanii
			wczytajKomentarzeDlaKampanii(el);
		}
	});
}

$(document).ready(function() {

	// pobieramy listę kampanii
	pobierzListeKampanii($miejsceNaKampanie);

	

	// var alertBox = $(".monitorowanie-kampanii .alert-box");
	// var miejsce = $(".monitorowanie-kampanii .container .stworzone-kampanie");
	// // zapytania GET na listę kampanii reklamowych 
	
	// $.ajax({
	// 	url: 'http://q4.maszyna.pl/api/adds',
	// 	type: 'get',
	// 	dataType: 'json',

	// 	error: function(){
	// 		var errorBox = "";
	// 		errorBox += '<div class="alert alert-error">';
 //      errorBox += 	'<h4><strong>Nie udało się pobrać informacji z serwera, wystąpił błąd.</strong></h4>';
 //    	errorBox += '</div>';
 //    	alertBox.append(errorBox);
	// 		console.log("error");				
	// 	},
	// 	beforeSend: function() {
	// 		var infoBox = "";
	// 		infoBox += '<div class="alert alert-info">';
 //    	infoBox += 	'<h4><strong>Trwa pobieranie informacji z serwera, proszę czekać.</strong></h4>';
 //    	infoBox += '</div>';
 //    	alertBox.append(infoBox);
	// 		console.log("wysyłamy zapytanie");
	// 	},
	// 	complete: function() {
	// 		// usuwamy box alert-info, zostawiamy alert-error jeśli wystąpił błąd
	// 		$(".alert-info").alert('close');
	// 		console.log("request completed");
	// 	},
	// 	success: function(data) {
	// 		$.each(data, function(index, item){		
	// 			jsonObj.campaigns.push({
	// 				"id" : item._id.$id,
	// 				"name": item.name
	// 			});
	// 			// tworzymy szkielet html do którego będą wrzucone dane z GET
	// 			var htmlString = "";
	// 			htmlString += '<li class="media span6" data-id-kampanii="'+ item._id.$id + '"' + 'data-nazwa-kampanii="'+ item.name + '"' +  '>';
	// 			htmlString += 	'<div class="span12 well-campaign">';
	// 			htmlString += 		'<div class="pull-left">';
	// 			htmlString += 			'<img class="media-object" src="/uploads/' + item.path + '"' + '</img>';
	// 			htmlString += 		'</div>';
	// 			htmlString += 		'<div class="media-body">';
	// 			htmlString += 			'<h1>' + item.name +  '</h1>';
	// 			htmlString += 		'</div>';
	// 			htmlString += 		'<div class="media-details">';
	// 			htmlString += 			'<p class="lead">' + item.text +  '</p>';
	// 			htmlString += 		'</div>';
	// 			htmlString += 		'<div class="media-buttons">';
	// 			htmlString += 			'<a href="#" class="pull-left pokaz-szczegoly" alt=""><i class="icon-comment"></i>Pokaż szczegóły</a>';
	// 			htmlString += 			'<a href="#" class="pull-right usun-kampanie" alt=""><i class="icon-trash"></i>Usuń kampanię</a>';
	// 			htmlString += 		'</div>';
	// 			htmlString += 	'</div>';
	// 			htmlString += '</li>';
	// 			miejsce.append(htmlString);
	// 		});
	// 		$(".alert").alert('close');
	// 		dodajEfektyWizualneDoKampanii();
	// 		dodajWyswietlanieSzczegolow();
		
	// 		// obiekt json, w którym przechowujemy informacje o kampaniach, id + nazwa
	// 		// dzięku temu w filtrowaniu posłużymy się id do ukrywania	
	// 			// fuzzyS(jsonObj);
	// 	}
	// });
	// fuzzyS(jsonObj);


});