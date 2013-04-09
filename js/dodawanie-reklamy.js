/*
	js for dodawanie-reklamy.html

*/

var b1 = false, // etap-pierwszy textarea test
		b2 = false, // etap-trzeci input test
		sK = $("#stworz-reklame-button"),
		etap_pierwszy = $(".etap-pierwszy textarea"),
		etap_trzeci_input = $(".etap-trzeci .nazwa-reklamy-input");

var checkEtapy = function() {
	if (b1 && b2 ){
		sK.removeClass('disabled');
	} else { 
		sK.addClass('disabled'); 
	}
}

$(document).ready(function() {

	/* plugin dla textarea do sprawdzania ilości znaków */	
	$("#wiadomoscDoWyslania").charCount({
		allowed: 140,
		warning: 30,
		counterText: 'Pozostało: '
	});

	/*
	przycisk do stworzenia kampanii powinien być aktywny dopiero gdy wszystkie etapy
	zostały wykonane
	*/
	etap_pierwszy.on('keyup', function() {
		if (etap_pierwszy.val().length >= 1) {
			b1 = true;
		} else { b1 = false; }
		checkEtapy();
	});

	/*
	sprawdzamy czy użytkownik wybrał nazwę dla kampanii i wpisał ją w input
	*/
	etap_trzeci_input.on('keyup', function() {
		if (etap_trzeci_input.val().length >=1) {
			b2 = true;
		} else { b2 = false; }
		checkEtapy();
	});

});