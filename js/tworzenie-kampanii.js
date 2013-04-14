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



});