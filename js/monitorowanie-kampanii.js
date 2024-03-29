/*
	monitorowanie kampanii
*/

var $miejsceNaKampanie = $('.stworzone-kampanie'),
		jsonCampaigns = {
			campaigns: []
		},
		jsonAdds = {
			adds: []
		},
		_json,	
		jsonC,
		listaKont,
		komentarzeJ,
		screen_names = [];

/*	funkcja, która odpowiada za ustawienie pluginu timeago */
function timeAgo() {
	$('time.timeago').timeago();
}

/*	wyszukiwanie po nazwie kampanii albo nazwie reklamy 
		add/campaigns -> obiekt JSON, w którym mamy informacje do wyszukiwania
*/
function fuzzySearch(add, campaigns) {

	console.log("inside functon");

	var input = $("#nazwaKampanii"),
			input2 = $("#nazwaReklamy"),
			lista = $(".stworzone-kampanie .campaign-item"),
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
			$(".stworzone-kampanie .campaign-item").show();
		} else {
			// response nie jest pusty, ukrywamy / pokazujemy elementy bo zostało coś znalezione
			$lista = $('.stworzone-kampanie .campaign-item');

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
	function search1() {
		var options = {
			keys: ['name'],
			id: 'id'
		}
		var f = new Fuse(add.adds, options);
		var result = f.search(input2.val());

		// jeśli jest pusty response to pokazujemy wszystkie elementy na liscie 
		if (result.length == 0 ) {
			$(".stworzone-kampanie .campaign-item").show();
		} else {
			// response nie jest pusty, ukrywamy / pokazujemy elementy bo zostało coś znalezione
			$lista = $('.stworzone-kampanie .campaign-item');

			// przechodzimy po kolei po wszystkich elementach listy
			$.each($lista, function(el) {
				znaleziony = false;
				// ustawiamy id danej kampanii 
				$id =  $(this).attr('data-id-reklamy');
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
	input2.on("keyup", search1);
}

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

/*	funkcja, która wczytuje komentarze z serwera i dodaje je do widoku kampanii */
function wczytajKomentarzeDlaKampanii(el) {

	// będziemy przechodzić po każdej kampanii i tworzyć dla niej zapytanie + dodawać
	// komentarze 

	$.each(el.children().filter('article'), function(index, item) {
		// przechodzimy po kolejnej kampanii
		var id_kampanii = $(this).attr('data-id-kampanii');
		// zapisujemy nad jaką kampanią 'pracujemy'
		var campaign = el.children().filter('article[data-id-kampanii="'+id_kampanii+'"]');
		// miejsce gdzie będziemy umieszczać komentarze
		var comments = campaign.find('ul.comments');	
		
		$.ajax({
			url: 'http://q4.maszyna.pl/api/campaigns/feedback/' + id_kampanii, 
			type: 'get',
			dataType: 'json',
			error: function() {
				console.log('error');
			},
			beforeSend: function() {
				console.log('wysyłamy zapytanie');
				comments.append('<p class="comments-loading text-info">Trwa wczytywanie komentarzy...</p>');
			},
			complete: function() {
				console.log('request completed');
			},
			success: function(data) {
				// komentarzeJ = data;
				comments.find('p.comments-loading').remove();
				// sprawdzamy czy zostały dodane jakieś komentarze
				if (data == null ) {
					// nie ma dodanych jeszcze żadnych komentarzy
					console.log('brak komentarzy...');
					comments.append('<p class="text-warning">Brak komentarzy do kampanii</p>');
				} else {
					console.log("dodaje komentarze do " + id_kampanii);
					// dostaliśmy komentarze, wyświetlamy je
					// przechodzimy po wszystkich obiektach (jeden obiekt == jeden komentarz)
					$.each(data, function(index, item) {
						var htmlString = "";
						htmlString += '<li class="media comment">';
						htmlString += 	'<a class="pull-left avatar-left" href="#">';
						htmlString += 		'<img class="media-object" src=' + item.user.avatar_url + '>';
						htmlString += 	'</a>';
						htmlString += 	'<div class="media-body comment-content">';
						htmlString += 		'<h4 class="media-heading comment-header">';
						htmlString += 		item.user.username;
						htmlString += 		'<span class="comment-timestamp">';

						// małe problemy z czasami, musimy zmienić format na ISO/UTC tak żeby 
						// timeago dostał czas + strefę czasową (uwzgledniając zmianę czasu na letni
						// albo zimowy)
						// var comment_time = new Date(item.timestamp);
						// comment_time = comment_time.toGMTString();
						// comment_time = comment_time.toISOString();
						htmlString += 			'<time class="timeago" datetime="' + item.timestamp	+ '+0000' +'"></time>';
						htmlString += 		'</span>';
						htmlString += 		'</h4>';
						htmlString += 		'<p class="comment-text">';
						htmlString +=				item.message;
						htmlString += 		'</p>';
						htmlString += 	'</div>';
						htmlString += '</li>';
						comments.append(htmlString);
					});
				}
				timeAgo();
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

				// tworzymy JSON object by przetrzymywać podstawowe dane 
				// potrzebne do filtrowania
				jsonCampaigns.campaigns.push({
					"id": item.id,
					"name": item.name,
				});
				jsonAdds.adds.push({
					"id": item.add.id,
					"name": item.add.name
				});

				// tworzymy szkielet html do którego będą wrzucone dane z GET
				var htmlString = "";
				htmlString += '<article class="campaign-item well-custom row-fluid" data-id-kampanii="'+ item.id + '"' + ' data-nazwa-kampanii="'+ item.name + '"' + ' data-id-reklamy="' + item.add.id + '" data-nazwa-reklamy="' + item.add.name + '" >';
				htmlString += 	'<header class="span12 campaign-title" >';
				htmlString += 		'<h1>' + item.name + '</h1>';
				htmlString += 	'</header>';
				htmlString += 	'<div class="row-fluid" >';
				htmlString += 		'<div class="campaign-add span6" >';
				htmlString += 			'<h3 class="add-name">' + item.add.name + '</h3>';
				htmlString += 			'<img class="media-object" src="/uploads/' + item.add.path + '"' + '</img>';
				htmlString += 			'<p class="lead add-text">' + item.add.text + '</p>';
				htmlString += 		'</div>';
				htmlString += 			'<div class="campaign-accounts span6">';
				htmlString += 				'<h4 class="text-info">Konta biorące udział w kampanii</h4>';
				htmlString += 				'<hr>';
				htmlString += 				'<ul class="media-list accounts">';

				// accounts są przekazywane jako obiekt, który może zawierać wiele elementów
				// potrzebujemy kolejny .each żeby przejśc po każdym obiekcie

				$.each(item.accounts, function(indexA,itemA) {
					htmlString +=	'<li class="media account" data-id-account="' + itemA.id + '"' + ' data-account-screen_name="' + itemA.screen_name + '" >';
					htmlString += 	'<a class="pull-left" href="http://twitter.com/' + itemA.screen_name + '" >	';
					htmlString += 		'<h3>@' + itemA.screen_name + '</h3>';
					htmlString += 	'</a>';
					htmlString += '</li>';
				});

				htmlString += 				'</ul>';
				htmlString += 			'</div>';
				
				htmlString += 		'<div class="campaign-comments span6">';
				htmlString += 			'<h4 class="text-info">Komentarze</h4>';
				htmlString += 			'<hr>';
				// sekcja z komentarzami, wczytamy ją dopiero po stworzeniu wszystkich 
				// kampanii, na końcu będzie jej wywołanie 
				htmlString += 				'<ul class="media-list comments">';
				htmlString += 				'</ul>';
				htmlString += 		'</div>';
				htmlString += 	'</div>';	
				htmlString += 	'<footer class="campaign-info span12">';
				// pobieramy czas z 'twitpic_data' a nie z 'published'
				$.each(item.twitpic_data, function(indexL, itemL) {
					data_stworzenia_kampanii = itemL.timestamp;
				});
				htmlString += 		'<p><i class="icon-time"></i><time class="timeago" datetime="'+ item.published + '" ></time></p>';
				
				// potrzebujemy znów przejść po obiekcie i znaleźć linki do kampanii
				// w serwisie twitpic
				$.each(item.twitpic_data, function(indexL, itemL) {
					
					htmlString += '<p><a href="' + itemL.url + '" title="Link do kampanii w serwisie twitpic" target="_blank">' + itemL.url + '</a></p>';
				});
				htmlString += 	'</footer>';
				htmlString += '</article>';

				el.append(htmlString);
			});

			// timeago
			timeAgo();
			// dodajemy account names do naszego selectu
			dodajAccountData();
			
			// wczytujemy komentarze dla kampanii
			wczytajKomentarzeDlaKampanii(el);
		}
	});
	// filtrowanie kampanii na podstawie nazwy kampanii / reklamy
	fuzzySearch(jsonAdds, jsonCampaigns);
}


/*	funkcja, która pokazuje wszystkie kampanie */
function dodajObslugePrzyciskuPokazWszystkie() {
	$('.filtrowanie-buttons button').bind('click', function(event) {
		event.preventDefault();
		
		// pokazujemy wszystkie kampaniie
		$miejsceNaKampanie.find('article').show();

		// zmieniamy tekst wyświetlany przy wyborze kont
		$('.filtrowanie-buttons a.btn').text('Konta biorące udział w kampanii');

		// czyścimy input dla wyszukiwania reklam / kampanii
		$("#nazwaKampanii").val('');
		$("#nazwaReklamy").val('');
	});	

}

/*	funkcja, która dodaje obsługe pokazania tylko tych kampanii, w których 
		dane konto brało udział 
		el -> miejsce gdzie mamy naszą liste kont 
		*/
function dodajObslugeWyboruKonta(el) {
	el.find('li').bind('click', function(event) { 
		event.preventDefault();
		// zapisujemy account-name	
		_account_name = $(this).text();

		// ustawiamy account-name w miejscu gdzie jest lista kont
		$('.filtrowanie-buttons a.btn').text(_account_name);


		_c = $miejsceNaKampanie.children().find('ul.accounts').children().filter('[data-account-screen_name="' + _account_name + '"]');
		// ukrywamy wszystkie elementy
		$miejsceNaKampanie.find('article').hide();
		// pokazujemy te, które mają wybranego usera
		_c.parents('article').show();

	});
}


/*	funkcja, która wypełnia select nazwami kont tak by 
		móc potem filtrowac po nazwie kont wyświetlanie kampanie */
function dodajAccountData() {
	// przechodzimy po wszystkich kampaniach i znajdujemy 
	// nazwy kont
	$.each($miejsceNaKampanie, function(index, item) {
		$.each($(this).find('ul.accounts').children(), function(index, item) {
			// dodajemy do tablicy kolejne znalezione nazwy
			screen_names.push($(item).attr('data-account-screen_name'));
		});

	});
	// sortujemy tablice z nazwami
	screen_names.sort();
	
	// based on http://stackoverflow.com/questions/5506920/removing-duplicate-strings-using-javascript
	for(var i = 1; i < screen_names.length; i++){
    if(screen_names[i] === screen_names[i-1]){
        screen_names.splice(i,1);
        i--;
     }
	}
	// w momencie mamy już tablicę bez powtórzeń, możemy uzupełnić teraz nasz select
	$account_list = $('.filtrowanie-buttons .dropdown-menu');
	$.each(screen_names, function(index, item) {
		$account_list.append('<li><a href="#" alt="">' + item + '</a></li>');
	});

	dodajObslugeWyboruKonta($account_list);

}

$(document).ready(function() {

	// pobieramy listę kampanii
	pobierzListeKampanii($miejsceNaKampanie);

	// przycisk resetujący filtrowanie
	dodajObslugePrzyciskuPokazWszystkie();

});